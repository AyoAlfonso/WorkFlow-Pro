class Api::MeetingsController < Api::ApplicationController
  include StatsHelper
  before_action :set_meeting, only: [:update, :destroy, :show]

  respond_to :json

  def index
    week_to_review_start_time = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    @meetings = policy_scope(Meeting).personal_recent_or_incomplete_for_user(current_user).for_week_of_date(week_to_review_start_time)
    render 'api/meetings/index'
  end

  def create 
    #scope differs if team (assume you can only have one incomplete meeting, allow you to create another one for week if required)
    week_to_review_start_time = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    @meetings_already_present_for_week = params[:team_id] ? policy_scope(Meeting).team_meetings(params[:team_id]).with_template(params[:meeting_template_id]).for_week_of_date(week_to_review_start_time).incomplete : policy_scope(Meeting).personal_meetings.hosted_by_user(current_user).for_week_of_date(week_to_review_start_time)
    # @meeting = incomplete_meetings_for_today.first_or_create(meeting_params.merge({hosted_by: current_user}))
    # authorize @meeting
    # render 'api/meetings/create'

    if @meetings_already_present_for_week.present?
      @meeting = @meetings_already_present_for_week.first
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
    @milestone_progress_averages = @meeting.team.users.map do |user|
      milestones = Milestone.current_week_for_user(user)
      completed_milestones = milestones.inject(0) { |sum, m| m[:status] == "completed" ? sum + 1 : sum }
      milestones.length == 0 ? 0 : completed_milestones.fdiv(milestones.length)
    end
    @key_activities = KeyActivity.filter_by_team_meeting(@meeting.meeting_template_id, params[:team_id])
    authorize @key_activities
    @issues = Issue.where(team_id: params[:team_id])
    authorize @issues
    render json: { milestone_progress_averages: @milestone_progress_averages, key_activities: @key_activities, issues: @issues }
  end

  def notes
    if params[:filters].present?
      filters = JSON.parse(params[:filters])
      if filters["team_id"].present?
        @meetings = policy_scope(Meeting).where(team_id: filters["team_id"]).where(start_time: filters["start_date"].to_date.beginning_of_day..filters["end_date"].to_date.end_of_day).sort_by_start_time
      elsif filters["user_id"].present?
        @meetings = policy_scope(Meeting).where(hosted_by_id: filters["user_id"]).where(start_time: filters["start_date"].to_date.beginning_of_day..filters["end_date"].to_date.end_of_day).sort_by_start_time
      else
        @meetings = policy_scope(Meeting).where(start_time: filters["start_date"].to_date.beginning_of_day..filters["end_date"].to_date.end_of_day).sort_by_start_time
      end
    else
      @meetings = policy_scope(Meeting).sort_by_start_time
    end
    authorize @meetings
    @dates = @meetings.map{ |meeting| meeting.start_time.strftime("%a, %b%e") }.uniq
    @data = @dates.map{ |date| {date: date, items: @meetings.select { |meeting| meeting.start_time.strftime("%a, %b%e") == date } } }
    render json: @data
  end

  private

  def set_additional_data
    @team = @meeting.team_id ? Team.find(@meeting.team_id) : nil
    if @team.present?
      previous_week_start = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
      previous_week_end = previous_week_start + 6.days
      @current_week_average_user_emotions = @team.daily_average_users_emotion_scores_over_week(previous_week_start, previous_week_end)
      @current_week_average_team_emotions = @team.team_average_weekly_emotion_score(previous_week_start, previous_week_end)
      @previous_meeting = Meeting.where(team_id: @team.id, meeting_template_id: @meeting.meeting_template_id).second_to_last
      @emotion_score_percentage_difference = @team.compare_weekly_emotion_score(@current_week_average_team_emotions, @previous_meeting.present? && @previous_meeting.average_team_mood.present? ? @previous_meeting.average_team_mood : 0)
      @milestones = nil
      @habits_percentage_increase_from_previous_week = nil
      @stats_for_week = nil
      @my_current_milestones = nil
    else
      #if it's Monday or Tuesday, 
      @current_week_average_user_emotions = daily_average_users_emotion_scores_over_last_week(current_user)
      @current_week_average_team_emotions = average_weekly_emotion_score_over_last_week(current_user)
      @previous_meeting = Meeting.where(hosted_by: current_user, team_id: nil, meeting_template_id: @meeting.meeting_template_id).second_to_last
      @emotion_score_percentage_difference = current_user.compare_weekly_emotion_score(@current_week_average_team_emotions, @previous_meeting.present? && @previous_meeting.average_team_mood.present? ? @previous_meeting.average_team_mood : 0)
      @milestones = nil
      @habits_percentage_increase_from_previous_week = current_user.habits_percentage_increase_from_previous_week
      @stats_for_week = calculate_stats_for_week(current_user)
      @my_current_milestones = Milestone.current_week_for_user(current_user)
    end
  end

  def set_meeting
    @meeting = policy_scope(Meeting).find(params[:id])
    authorize @meeting
  end

  def meeting_params
    params.require(:meeting).permit(:id, :team_id, :meeting_template_id, :average_rating, :issues_done, :key_activities_done, :average_team_mood, :goal_progress, :start_time, :end_time, :start_time, :current_step, :host_name, :name, :notes)
  end
end