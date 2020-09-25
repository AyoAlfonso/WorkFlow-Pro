class NotificationEmailJob
  include Sidekiq::Worker
  include NotificationsHelper
  include NotificationEmailJobHelper

  def perform(notification_id)
    notification = Notification.find(notification_id)
    @user = notification.user
    @users_time = @user.time_in_user_timezone
    @schedule = IceCube::Schedule.from_hash(notification.rule)
    notification_type = human_type(notification.notification_type)
    # The job runs at top and bottom of each hour. There's a -10 and +5 minute buffer in case the job starts early or late.
    if schedule_occurs_between?(@user.time_in_user_timezone - 10.minutes, @user.time_in_user_timezone + 5.minutes)
      if notification_type == "Create My Day" && user_has_not_set_status
        send_person_planning_reminder_email(@user, notification_type)
      elsif notification_type == "Weekly Report"
        send_end_of_week_stats_email(@user, notification_type)
      elsif notification_type == "Weekly Alignment Meeting" && meeting_should_have_started('team_weekly')
        send_sync_meeting_email(@user, notification_type)
      elsif notification_type == "Weekly Planning" && meeting_should_have_started('personal_weekly')
        send_weekly_planning_meeting_email(@user, notification_type)
      end
    end
  end

  def schedule_occurs_between?(earlier_time, later_time)
    # previous_occurrence in 10 minutes is really the 'current' notification occurrence
    notify_time = @schedule.previous_occurrence(Time.current + 10.minutes).try(:to_datetime)
    return unless notify_time
    # asctime.in_time_zone changes the zone - not the time so instead of the notification
    # being scheduled for 17:00 +00:00 it'll be 17:00 -07:00 for example
    notify_time_in_users_timezone = notify_time.asctime.in_time_zone(@user.users_timezone_name)
    notify_time_in_users_timezone > earlier_time && notify_time_in_users_timezone < later_time
  end

  def user_has_not_set_status
    most_recent_daily_log = @user.daily_logs.order(:created_at).last
    if most_recent_daily_log.log_date < Date.today && @users_time >= @user.time_in_user_timezone('noon')
      return true
    end
  end

  def meeting_should_have_started(meeting_type)
    # meetings that should have started in the last 30 minutes but haven't
    meetings = @user.team_meetings
                .where(start_time: nil)
                .where("scheduled_start_time < ?", @users_time)
                .where("scheduled_start_time > ?", @users_time - 30.minutes)
    meetings.each do |meeting|
      return true if meeting.meeting_template.meeting_type == meeting_type
    end
  end
end
