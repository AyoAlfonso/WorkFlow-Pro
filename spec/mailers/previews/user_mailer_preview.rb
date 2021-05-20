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
end
