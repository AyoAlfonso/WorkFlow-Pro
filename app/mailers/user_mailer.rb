
class UserMailer < ApplicationMailer
  default from: 'no-reply@lynchpyn.com'
  layout 'mailer'
 
  def notification_email
    @user = params[:user]
    @subject = "Notification - #{params[:subject]}"
    @message = params[:message]
    mail(to: @user.email, subject: @subject)
  end
end