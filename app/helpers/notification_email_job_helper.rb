module NotificationEmailJobHelper
  def send_person_planning_reminder_email(user, notification_type)
    UserMailer.with(
      user: user,
      subject: "Today's Focus",
      greeting: "Hi #{user&.first_name}!",
      message: "See what you have on the table for today and set yourself up for success!",
      cta_text: "Plan My Day",
      cta_url: "", # home
    ).daily_planning_email.deliver_later
  end

  def send_evening_reflection_reminder_email(user, notification_type)
    UserMailer.with(
      user: user,
      subject: "#{user&.first_name}, Time for Your Evening Reflection",
      greeting: "Good Evening #{user&.first_name}!",
      message: "Remember we don't learn from our experiences, we learn from reflecting on our experiences! Take some time to reflect. Your future self will be glad you did.",
      cta_text: "Evening Reflection",
      cta_url: "", #home
    ).notification_email.deliver_later
  end

  # Report
  def send_end_of_week_stats_email(user, notification_type)
    UserMailer.with(
      user: user,
      subject: "#{user.first_name}, Time to Plan for Next Week",
      greeting: "Hi #{user&.first_name}! 👋",
      message: "",
    ).end_of_week_stats.deliver_later
  end

  def send_weekly_check_in_report_stats_email(user, notification_type, team)
    previous_week_start = get_beginning_of_last_or_current_work_week_date(Time.now)
    previous_week_end = previous_week_start + 6.days
    kpis = (KeyPerformanceIndicator).vieweable_by_entity("team", team.id).as_json().map do |index, kpi|
      return kpi["scorecard_logs"]?.last
    end
    KeyPerformanceIndicator.vieweable_by_entity("team", 2).where(title: 1).as_json()[0]
    
    ["scorecard_logs"][0]
    UserMailer.with(
      user: user,
      subject: "Weekly Report for Leadership Team",
      greeting: "",
      name: "",
      message: "Share what you’ve accomplished with your teammates and see how they performed.",
      preheader: " See your team’s progress towards the plan, from week of #{Time.now.beginning_of_week.strftime("%b %-d,")} -  #{Time.now.end_of_week.strftime("%b %-d,")}",
      start_date: previous_week_start.strftime("%b %-d,"), 
      end_date: previous_week_end.strftime("%b %-d,"),
      team: team,
      kpis:kpis,
      cta_text: "See More in in Lynchpyn",
      cta_url: ""
    ).weekly_check_in_report_stats_email.deliver_later
  end

  def send_weekly_checkin_email(user, notification_type)
    UserMailer.with(
      user: user,
      subject:"Weekly Check-in: Please add an update",
      greeting: "",
      name: "#{user&.first_name}",
      message: "Share what you’ve accomplished with your teammates and see how they performed.",
      preheader: "Preheader: You have some updates to provide for your Initiatives and KPIs in LynchPyn.",
      cta_text: "Complete Weekly Check-in",
      cta_url: "/weekly-check-in/#{user.id}/#{Date.today.strftime("%Y-%m-%d")}"
    ).weekly_checkin_email.deliver_later
  end

  def send_sync_meeting_email(user, notification_type, team)
    UserMailer.with(
      user: user,
      team: team,
      subject: "#{user&.first_name}, Your Upcoming Weekly Alignment Meeting",
      greeting: "Hi #{user&.first_name}!",
      message: "You have an upcoming Weekly Alignment Meeting with your team. Go to the team page and start the meeting:",
      cta_text: "Weekly Alignment Meeting",
      cta_url: "/team/#{team.id}",
    ).notification_email.deliver_later
  end

  def send_weekly_planning_email(user, notification_type)
    UserMailer.with(
      user: user,
      subject: "Weekly Review: How your week went and what's next",
      message: "Check out your progress from last week in numbers and plan for the week ahead.",
      greeting: "Hi #{user&.first_name}!",
      cta_text: "Plan Your Week",
      cta_url: "", # home
    ).weekly_planning_email.deliver_later
  end
end
