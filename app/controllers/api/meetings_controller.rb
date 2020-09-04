class Api::MeetingsController < Api::ApplicationController
  before_action :set_meeting, only: [:update, :destroy, :show]

  respond_to :json

  def index 
    @meetings = policy_scope(Meeting).personal_recent_or_incomplete_for_user(current_user)
    render 'api/meetings/index'
  end

  def create 
    #TODO: replaec scope with for week or for month, etc. based on type
    incomplete_meetings_for_today = Meeting.team_meetings(params[:team_id]).with_template(params[:meeting_template_id]).for_day(Date.today).incomplete #TODO: VERIFY THIS WORKS OVER MIDNIGHT IN DIFFERENT TIMEZONES
    
    # @meeting = incomplete_meetings_for_today.first_or_create(meeting_params.merge({hosted_by: current_user}))
    # authorize @meeting
    # render 'api/meetings/create'

    if incomplete_meetings_for_today.incomplete.present?
      @meeting = incomplete_meetings_for_today.first
      set_additional_data
      authorize @meeting
      render 'api/meetings/show'  
    else
      @meeting = Meeting.new(meeting_params)
      @meeting.hosted_by_id = current_user.id
      set_additional_data
      authorize @meeting
      @meeting.save!
      render 'api/meetings/show'
    end
  end

  def show
    set_additional_data
    render 'api/meetings/show'
  end

  def update
    @meeting.update!(meeting_params)
    set_additional_data
    render 'api/meetings/update'
  end

  def destroy
    @meeting.destroy!(meeting_params)
    render json: { meeting_id: @meeting.id, status: :ok }
  end

  def team_meetings
    @meetings = Meeting.team_meetings(params[:id]).sort_by_creation_date
    authorize @meetings
    render 'api/meetings/team_meetings'
  end

  def meeting_recap
    @meeting = Meeting.find(params[:id])
    @milestones = Milestone.for_users_in_team(params[:team_id])
    @key_activities = KeyActivity.filter_by_team_meeting(@meeting.meeting_template_id, params[:team_id])
    authorize @key_activities
    @issues = Issue.where(team_id: params[:team_id])
    authorize @issues
    render json: { milestones: @milestones, key_activities: @key_activities, issues: @issues }
  end

  private

  def set_additional_data
    @team = @meeting.team_id ? Team.find(@meeting.team_id) : nil
    if @team.present?
      @current_week_average_user_emotions = @team.weekly_average_users_emotion_score(1.week.ago, 1.day.ago)
      @current_week_average_team_emotions = @team.team_average_weekly_emotion_score(1.week.ago, 1.day.ago)
      @previous_meeting = Meeting.where(team_id: @team.id, meeting_template_id: @meeting.meeting_template_id).second_to_last
      @emotion_score_percentage_difference = @team.compare_weekly_emotion_score(@current_week_average_team_emotions, @previous_meeting.present? && @previous_meeting.average_team_mood.present? ? @previous_meeting.average_team_mood : 0)
      @milestones = nil
      @habits_percentage_increase_from_previous_week = nil
      @stats_for_week = nil
      @my_current_milestones = nil
    else
      @current_week_average_user_emotions = current_user.weekly_average_users_emotion_score(1.week.ago, 1.day.ago)
      @current_week_average_team_emotions = current_user.team_average_weekly_emotion_score(1.week.ago, 1.day.ago)
      @previous_meeting = Meeting.where(hosted_by: current_user, team_id: nil, meeting_template_id: @meeting.meeting_template_id).second_to_last
      @emotion_score_percentage_difference = current_user.compare_weekly_emotion_score(@current_week_average_team_emotions, @previous_meeting.present? && @previous_meeting.average_team_mood.present? ? @previous_meeting.average_team_mood : 0)
      @milestones = nil
      @habits_percentage_increase_from_previous_week = current_user.habits_percentage_increase_from_previous_week
      @stats_for_week = calculate_stats_for_week
      @my_current_milestones = Milestone.current_week_for_user(current_user)
    end
  end

  def calculate_stats_for_week
    previous_week_end = current_user.time_in_user_timezone.beginning_of_week
    previous_week_start = previous_week_end.weeks_ago(1)
    previous_2_week_start = previous_week_end.weeks_ago(2)
    ka_created_last_week = KeyActivity.user_created_between(current_user, previous_week_start, previous_week_end).count
    ka_created_2_weeks = KeyActivity.user_created_between(current_user, previous_2_week_start, previous_week_start).count
    ka_created_change = ka_created_2_weeks != 0 ? (ka_created_last_week / ka_created_2_weeks)*100 : 0
    ka_completed_last_week = KeyActivity.user_completed_between(current_user, previous_week_start, previous_week_end).count
    ka_completed_2_weeks = KeyActivity.user_completed_between(current_user, previous_2_week_start, previous_week_start).count
    ka_completed_change = ka_completed_2_weeks != 0 ? (ka_completed_last_week / ka_completed_2_weeks)*100 : 0
    issues_created_last_week = Issue.user_created_between(current_user, previous_week_start, previous_week_end).count
    issues_created_2_weeks = Issue.user_created_between(current_user, previous_2_week_start, previous_week_start).count
    issues_created_change = issues_created_2_weeks != 0 ? (issues_created_last_week / issues_created_2_weeks)*100 : 0

    [
      {
        statistic_name: "#{I18n.t('key_activities')} Created",
        statistic_number: ka_created_last_week,
        statistic_change: ka_created_change,
      }, 
      {
        statistic_name: "#{I18n.t('key_activities')} Completed",
        statistic_number: ka_completed_last_week,
        statistic_change: ka_completed_change
      },
      {
        statistic_name: "#{I18n.t('issues')} Created",
        statistic_number: issues_created_last_week,
        statistic_change: issues_created_change
      }
    ]
  end

  def set_meeting
    @meeting = policy_scope(Meeting).find(params[:id])
    authorize @meeting
  end

  def meeting_params
    params.require(:meeting).permit(:id, :team_id, :meeting_template_id, :average_rating, :issues_done, :key_activities_done, :average_team_mood, :goal_progress, :start_time, :end_time, :scheduled_start_time, :current_step, :host_name, :name)
  end
end