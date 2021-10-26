class UserMailer < ApplicationMailer
  helper StatsHelper
  helper ActionView::Helpers::SanitizeHelper
  include StatsHelper
  default from: "LynchPyn <no-reply@lynchpyn.com>"
  layout "mailer"

  def notification_email
    @user = params[:user]
    @subject = params[:subject]
    @message = params[:message]
    @greeting = params[:greeting]
    @cta_text = params[:cta_text]
    @cta_url = params[:cta_url]
    mail(to: @user.email, subject: @subject)
  end

  def weekly_planning_email
    @user = params[:user]
    @subject = params[:subject]
    @greeting = params[:greeting]
    @message = params[:message]
    beginning_of_last_week = get_beginning_of_last_or_current_work_week_date(@user.time_in_user_timezone - 7.days)
    end_of_last_week = beginning_of_last_week + 6.days
    beginning_of_week = get_beginning_of_last_or_current_work_week_date(@user.time_in_user_timezone)
    end_of_week = beginning_of_week + 6.days
    beginning_of_next_week = get_next_week_or_current_week_date(@user.time_in_user_timezone)
    end_of_next_week = beginning_of_next_week + 6.days
    @last_week_completed_pyns = @user.key_activities.where(completed_at: beginning_of_last_week..end_of_last_week)
    @this_week_completed_pyns = @user.key_activities.where(completed_at: beginning_of_week..end_of_week)
    @next_week_pyns = @user.key_activities.where(completed_at: nil).where("due_date <= ?", end_of_next_week)
    @next_quarterly_milestones = Milestone.current_week_for_user(beginning_of_next_week, @user, "QuarterlyGoal")
    @next_subinitiative_milestones = Milestone.current_week_for_user(beginning_of_next_week, @user, "SubInitiative")
    # week_to_review_start_time = get_beginning_of_last_or_current_work_week_date(@user.time_in_user_timezone)
    # @meeting = Meeting.first_or_create_for_weekly_planning_on_email(@user, week_to_review_start_time)
    @cta_text = params[:cta_text]
    @cta_url = params[:cta_url]
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
    @habits = @user.habits
    @cta_text = params[:cta_text]
    @cta_url = params[:cta_url]
    mail(to: @user.email, subject: @subject)
  end
end
