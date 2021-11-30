class UserMailerPreview < ActionMailer::Preview
  def notification_email
    message = <<~MESSAGE
      Hey, it's time to design your email!

      Add new rows, drag and drop blocks from the right sidebar, move things around and make this email yours.
    MESSAGE
    UserMailer.with(
      user: User.first,
      subject: 'Test Email',
      message: message,
      greeting: 'Your email headline goes here',
      cta_text: 'Add button text',
      cta_url: ''
    ).notification_email
  end

  def daily_planning_email
    user = User.find(3)
    UserMailer.with(
      user: user,
      subject: 'Today\'s Focus',
      message: 'See what you have on the table for today and set yourself up for success!',
      greeting: "Hi #{user.first_name}! 👋",
      cta_text: 'Plan My Day',
      cta_url: '' # home
    ).daily_planning_email
  end
  
  def weekly_planning_email
    user = User.find(3)
    UserMailer.with(
      user: user,
      subject: "Weekly Review: How your week went and what's next",
      greeting: "Hi #{user.first_name}! 👋",
      message: "Check out your progress from last week in numbers and plan for the week ahead.",
      cta_text: "Plan Your Week",
      cta_url: "" # home
    ).weekly_planning_email
  end

  def evening_reflection_email
    user = User.find(3)
    UserMailer.with(
      user: user,
      subject: "#{user&.first_name}, Time for Your Evening Reflection",
      greeting: "Good Evening #{user&.first_name}!",
      message: "Remember we don't learn from our experiences, we learn from reflecting on our experiences! Take some time to reflect. Your future self will be glad you did.",
      cta_text: "Evening Reflection",
      cta_url: "" #home
    ).notification_email
  end

  def send_weekly_check_in_report_stats_email
    user = User.find(3)
    UserMailer.with(
      user: user,
      subject: "Weekly Report for Leadership Team",
      greeting: "Leadership Team",
      name: "",
      message: "Share what you’ve accomplished with your teammates and see how they performed.",
      preheader: " See your team’s progress towards the plan, from week of Nov 1 - Nov 6",
      cta_text: "Complete Weekly Check-in",
      cta_url: "/weekly-check-in/#{user.id}/#{Date.today.strftime("%Y-%m-%d")}" #home
    ).weekly_check_in_report_stats_email
  end

  def checkin_reminder_email
    user = User.find(3)
    UserMailer.with(
      user: user,
      subject:"Weekly Check-in: Please add an update",
      greeting: "",
      name: "#{user&.first_name}",
      message: "Share what you’ve accomplished with your teammates and see how they performed.",
      preheader: "You have some updates to provide for your Initiatives and KPIs in LynchPyn.",
      cta_text: "Complete Weekly Check-in",
      cta_url: "/weekly-check-in/#{user.id}/#{Date.today.strftime("%Y-%m-%d")}" #home
    ).weekly_checkin_email
  end

  def sync_meeting_email
    user = User.find(3)
    team = user.team_user_enablements.team_lead.last&.team
    UserMailer.with(
      user: user,
      team: team,
      subject: "#{user&.first_name}, Your Upcoming Weekly Alignment Meeting",
      greeting: "Hi #{user&.first_name}!",
      message: "You have an upcoming Weekly Alignment Meeting with your team. Go to the team page and start the meeting:",
      cta_text: "Weekly Alignment Meeting",
      cta_url: "/team/#{team.id}"
    ).notification_email
  end
end
