module NotificationEmailJobHelper
  def send_person_planning_reminder_email(user, notification_type)
    UserMailer.with(
      user: user,
      subject: "Today's Focus",
      greeting: "Hi #{user&.first_name}!",
      message: "See what you have on the table for today and set yourself up for success!",
      cta_text: "Plan My Day",
      cta_url: "" # home
    ).daily_planning_email.deliver_later
  end

  def send_evening_reflection_reminder_email(user, notification_type)
    UserMailer.with(
      user: user,
      subject: "#{user&.first_name}, Time for Your Evening Reflection",
      greeting: "Good Evening #{user&.first_name}!",
      message: "Remember we don't learn from our experiences, we learn from reflecting on our experiences! Take some time to reflect. Your future self will be glad you did.",
      cta_text: "Evening Reflection",
      cta_url: "" #home
    ).notification_email.deliver_later
  end

  def send_end_of_week_stats_email(user, notification_type)
    UserMailer.with(
      user: user,
      subject: "#{user.first_name}, Time to Plan for Next Week",
      greeting: "Hi #{user&.first_name}! 👋",
      message: ""
    ).end_of_week_stats.deliver_later
  end

  def send_sync_meeting_email(user, notification_type, team)
    UserMailer.with(
      user: user,
      team: team,
      subject: "#{user&.first_name}, Your Upcoming Weekly Alignment Meeting",
      greeting: "Hi #{user&.first_name}!",
      message: "You have an upcoming Weekly Alignment Meeting with your team. Go to the team page and start the meeting:",
      cta_text: "Weekly Alignment Meeting",
      cta_url: "/team/#{team.id}"
    ).notification_email.deliver_later
  end

  def send_weekly_planning_email(user, notification_type)
    UserMailer.with(
      user: user,
      subject: "Weekly Review: How your week went and what's next",
      message: "Check out your progress from last week in numbers and plan for the week ahead.",
      greeting: "Hi #{user&.first_name}!",
      cta_text: "Plan Your Week",
      cta_url: "" # home
    ).weekly_planning_email.deliver_later
  end
end
