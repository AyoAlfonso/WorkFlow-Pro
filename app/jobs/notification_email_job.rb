class NotificationEmailJob
  include Sidekiq::Worker
  include NotificationsHelper
  include NotificationEmailJobHelper

  def perform(notification_id)
    notification = Notification.find(notification_id)
    @user = notification.user
    @users_time = @user.time_in_user_timezone
    schedule = IceCube::Schedule.from_hash(notification.rule)
    notification_type = human_type(notification.notification_type)
    # The job runs at top and bottom of each hour. There's a -10 and +5 minute buffer in case the job starts early or late.
    if schedule.occurs_between?(@user.time_in_user_timezone - 10.minutes, @user.time_in_user_timezone + 5.minutes)
      if notification_type == "Daily Personal Planning" && user_has_not_set_status
        send_person_planning_reminder_email(@user, notification_type)
      elsif notification_type == "End Of Week Stats"
        send_end_of_week_stats_email(@user, notification_type)
      elsif notification_type == "Sync Meeting" && meeting_should_have_started('team_weekly')
        send_sync_meeting_email(@user, notification_type)
      elsif notification_type == "Weekly Personal Planning" && meeting_should_have_started('personal_weekly')
        send_weekly_planning_meeting_email(@user, notification_type)
      end
    end
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
