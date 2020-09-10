class UserMailer < ApplicationMailer
  add_template_helper(StatsHelper)
  default from: 'LynchPyn <no-reply@lynchpyn.com>'
  layout 'mailer'

  def notification_email
    @user = params[:user]
    @subject = "Notification - #{params[:subject]}"
    @message = params[:message]
    mail(to: @user.email, subject: @subject)
  end

  def end_of_week_stats
    @user = params[:user]
    @subject = "Weekly Report"
    @message = params[:message]
    mail(to: @user.email, subject: @subject)
  end
end
