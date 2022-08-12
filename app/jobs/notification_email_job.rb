class NotificationEmailJob
  include Sidekiq::Worker
  include NotificationsHelper
  include NotificationEmailJobHelper
  include StatsHelper

  def perform(notification_id)
      notification = Notification.find(notification_id)
      @user = notification.user
      @users_time = @user.time_in_user_timezone
      @schedule = IceCube::Schedule.from_hash(notification.rule)
      notification_type = human_type(notification.notification_type)
      # The job runs at top and bottom of each hour. There's a -10 and +5 minute buffer in case the job starts early or late.
        if schedule_occurs_between(@user, @schedule)
          if notification_type == "Daily Planning" && user_has_not_set_status
            return if is_weekend?
            send_person_planning_reminder_email(@user, notification_type)
          elsif notification_type == "Weekly Report"
              send_end_of_week_stats_email(@user, notification_type)
          elsif notification_type == "Evening Reflection"
              if !@user.evening_reflection_complete
                send_evening_reflection_reminder_email(@user, notification_type)
              end
          elsif notification_type == "Weekly Planning"
            send_weekly_planning_email(@user, notification_type)
          elsif notification_type == "Weekly Checkin"
            send_weekly_checkin_email(@user, notification_type)
          elsif notification_type ==  "Dynamic Checkin"
            if(notification.parent_id == "CheckInArtifact")
              check_in_artifact = CheckInArtifact.where(id: notification.parent_id, created_by_id: @user.id)&.last
              send_dynamic_checkin_email(@user, notification_type, check_in_artifact.id)
            end
          elsif notification_type == "Weekly Checkin Report"
             @user.team_user_enablements.team_lead.each do |team_lead_enablement|
                 send_weekly_check_in_report_stats_email(@user, notification_type, team_lead_enablement&.team)
             end
          elsif notification_type == "Weekly Alignment Meeting" && meeting_did_not_start_this_period("team_weekly")
              @user.team_user_enablements.team_lead.each do |team_lead_enablement|
              if Meeting.team_weekly_meetings.team_meetings(team_lead_enablement&.team&.id).for_week_of_date_started_only(get_beginning_of_last_or_current_work_week_date(@user.time_in_user_timezone)).blank?
                send_sync_meeting_email(@user, notification_type, team_lead_enablement&.team)
              end
            end
          end
        end
  end

    def is_weekend?
      ["Saturday", "Sunday"].include?(@users_time.strftime("%A"))
    end

    def user_has_not_set_status
      most_recent_daily_log = @user.daily_logs.order(:created_at).last
      return true if most_recent_daily_log.blank?
      #if the daily log's log date is today in the user's timezone and the status is not set send it.
      # (It doesn't do a noon time check in case you want to set the notifcation) - @users_time >= @user.time_in_user_timezone('noon')
      if most_recent_daily_log.log_date == @user.time_in_user_timezone.to_date && most_recent_daily_log.work_status != "status_not_set"
        return false
      else
        return true
      end
    end

  def meeting_did_not_start_this_period(meeting_type)
      case meeting_type
        when "personal_weekly"
          Meeting.personal_meeting_for_week_on_user(@user, get_beginning_of_last_or_current_work_week_date(@user.time_in_user_timezone)).blank?
        when "team_weekly"
          @user.team_user_enablements.team_lead.any? do |team_lead_enablement|
            Meeting.team_weekly_meetings.team_meetings(team_lead_enablement&.team&.id).for_week_of_date_started_only(get_beginning_of_last_or_current_work_week_date(@user.time_in_user_timezone)).blank?
          end
        else
          false
        end
      end
    end
  
  def schedule_occurs_between(user, schedule)
    # previous_occurrence in 10 minutes is really the 'current' notification occurrence
    earlier_time = user.time_in_user_timezone - 10.minutes
    later_time = user.time_in_user_timezone + 5.minutes
    notify_time = schedule.previous_occurrence(Time.current + 10.minutes).try(:to_datetime)
    return unless notify_time
    # asctime.in_time_zone changes the zone - not the time so instead of the notification
    # being scheduled for 17:00 +00:00 it'll be 17:00 -07:00 for example
    notify_time_in_users_timezone = notify_time.asctime.in_time_zone(user.timezone_name)
    notify_time_in_users_timezone > earlier_time && notify_time_in_users_timezone < later_time
  end

  def user_has_not_set_status
    most_recent_daily_log = @user.daily_logs.order(:created_at).last
    return true if most_recent_daily_log.blank?
    #if the daily log's log date is today in the user's timezone and the status is not set send it.
    # (It doesn't do a noon time check in case you want to set the notifcation) - @users_time >= @user.time_in_user_timezone('noon')
    if most_recent_daily_log.log_date == @user.time_in_user_timezone.to_date && most_recent_daily_log.work_status != "status_not_set"
      return false
    else
      return true
    end
  end

  def meeting_did_not_start_this_period(meeting_type)
    case meeting_type
    when "personal_weekly"
      Meeting.personal_meeting_for_week_on_user(@user, get_beginning_of_last_or_current_work_week_date(@user.time_in_user_timezone)).blank?
    when "team_weekly"
      @user.team_user_enablements.team_lead.any? do |team_lead_enablement|
        Meeting.team_weekly_meetings.team_meetings(team_lead_enablement&.team&.id).for_week_of_date_started_only(get_beginning_of_last_or_current_work_week_date(@user.time_in_user_timezone)).blank?
      end
    else
      false
    end
  end