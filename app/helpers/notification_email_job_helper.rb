module NotificationEmailJobHelper
  def send_person_planning_reminder_email(user, notification_type)
    UserMailer.with(
      user: @user,
      subject: notification_type,
      message: "Hi #{@user&.first_name}, \n \n Just a quick reminder to set your status."
    ).notification_email.deliver_later
  end

  def send_end_of_week_stats_email(user, notification_type)
    UserMailer.with(
      user: @user,
      subject: notification_type,
      message: "Hi #{@user&.first_name}, \n \n Here is your weekly report."
    ).end_of_week_stats.deliver_later
  end

  def send_sync_meeting_email(user, notification_type)
    UserMailer.with(
      user: @user,
      subject: notification_type,
      message: "Hi #{@user&.first_name}, \n \n Just a quick reminder to start your Weekly Alignment Meeting."
    ).notification_email.deliver_later
  end

  def send_weekly_planning_meeting_email(user, notification_type)
    UserMailer.with(
      user: @user,
      subject: notification_type,
      message: "Hi #{@user&.first_name}, \n \n Just a quick reminder to start your Weekly Planning Meeting."
    ).notification_email.deliver_later
  end
end
