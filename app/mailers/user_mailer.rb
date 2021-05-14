class UserMailer < ApplicationMailer
  add_template_helper(StatsHelper)
  include StatsHelper
  default from: 'LynchPyn <no-reply@lynchpyn.com>'
  layout 'mailer'

  def notification_email
    @user = params[:user]
    @subject = params[:subject]
    @message = params[:message]
    @greeting = params[:greeting]
    @cta_text = params[:cta_text]
    @cta_url = params[:cta_url]
    mail(to: @user.email, subject: @subject)
  end

  def end_of_week_stats
    @user = params[:user]
    @subject = params[:subject]
    @greeting = params[:greeting]
    @message = params[:message]
    week_to_review_start_time = get_beginning_of_last_or_current_work_week_date(@user.time_in_user_timezone)
    @meeting = Meeting.first_or_create_for_weekly_planning_on_email(@user, week_to_review_start_time)
    mail(to: @user.email, subject: @subject)
  end

  def team_meeting_email
    @user = params[:user]
    @team = params[:team]
    @subject = params[:subject]
    @greeting = params[:greeting]
    @message = params[:message]
    @cta_text = "Start Meeting"
    @cta_url = "/team/#{@team.id}"
    mail(to: @user.email, subject: @subject)
  end

  def daily_planning_email
    @user = params[:user]
    @subject = params[:subject]
    @greeting = params[:greeting]
    @message = params[:message]
    @todays_list = @user.key_activities.where(completed_at: nil, scheduled_group_id: 1)
    @due_today = @user.key_activities.where(completed_at: nil, due_date: @user.time_in_user_timezone.to_date).where("scheduled_group_id != ?", 1)
    @overdue = @user.key_activities.where(completed_at: nil).where("due_date < ?", @user.time_in_user_timezone.to_date)
    @cta_text = params[:cta_text]
    @cta_url = params[:cta_url]
    mail(to: @user.email, subject: @subject)
  end

end
