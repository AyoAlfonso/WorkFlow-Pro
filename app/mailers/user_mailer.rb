class UserMailer < ApplicationMailer
  add_template_helper(StatsHelper)
  include StatsHelper
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
    week_to_review_start_time = get_beginning_of_last_or_current_work_week_date(@user.time_in_user_timezone)
    @meeting = Meeting.first_or_create_for_weekly_planning_on_email(@user, week_to_review_start_time)
    mail(to: @user.email, subject: @subject)
  end
end
