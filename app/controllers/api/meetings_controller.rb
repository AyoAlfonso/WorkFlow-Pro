class Api::MeetingsController < Api::ApplicationController
  include StatsHelper
  before_action :set_meeting, only: [:update, :destroy, :show]
  after_action :verify_authorized, except: [:index, :search], unless: :skip_pundit?
  after_action :verify_policy_scoped, only: [:index, :search], unless: :skip_pundit?

  respond_to :json

  def index
    week_to_review_start_time = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    @meetings = policy_scope(Meeting).personal_recent_or_incomplete_for_user(current_user).for_week_of_date(week_to_review_start_time)
    render 'api/meetings/index'
  end

  def search
    #if its for a forum, it should authorize the search if you can access the team_id in the params
    authorize Team.find(params[:team_id]), :show?, policy_class: TeamPolicy
    #allow year and meeting type 
    @meetings = MeetingSearch.new(policy_scope(Meeting), search_meeting_params).search
    render 'api/meetings/index'
  end

  def create 
    if current_company.display_format === "Company"
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
    else 
      month_to_review_start_time = current_user.time_in_user_timezone.beginning_of_month
      @meetings_already_present_for_month = params[:team_id] ? policy_scope(Meeting).team_meetings(params[:team_id]).with_template(params[:meeting_template_id]).for_month_of_date(month_to_review_start_time).incomplete : policy_scope(Meeting).personal_monthly_meetings.hosted_by_user(current_user).for_month_of_date(month_to_review_start_time)
    
      if @meetings_already_present_for_month.present?
        @meeting = @meetings_already_present_for_month.first
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
  end

  def start_next_for
    #takes in team and meeting type to see if there is one in range
    @meeting = case(params[:meeting_type])
    when "forum_monthly"
      policy_scope(Meeting).team_meetings(params[:team_id]).for_type(params[:meeting_type]).for_scheduled_start_date_range(current_user.convert_to_their_timezone.beginning_of_month, current_user.convert_to_their_timezone.end_of_month).last
    else
      nil
    end

    if @meeting.blank?
      #raise error
      raise "No meeting has created beforehand for this period, please do that."
    elsif @meeting.end_time.present? && @meeting.meeting_template_id == MeetingTemplate.forum_monthly.first.id
      old_meeting = @meeting
      @meeting = Meeting.create!({
        meeting_template_id: old_meeting.meeting_template_id, 
        scheduled_start_time: old_meeting.scheduled_start_time,
        hosted_by_id: old_meeting.hosted_by_id,
        team_id: old_meeting.team_id,
        host_name: old_meeting.host_name,
        current_step: 0})
      authorize @meeting, :update?
      render 'api/meetings/show'
    else
      authorize @meeting, :update?
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

  def team_meetings #id is team_id in this case
    @meetings = Meeting.team_meetings(params[:id]).sort_by_creation_date
    authorize @meetings
    render 'api/meetings/team_meetings'
  end

  def meeting_recap
    @meeting = Meeting.find(params[:id])
    @milestone_progress_averages = @meeting.team.users.map do |user|
      milestones = Milestone.current_week_for_user(get_beginning_of_last_or_current_work_week_date(user.time_in_user_timezone), user)
      completed_milestones = milestones.inject(0) { |sum, m| m[:status] == "completed" ? sum + 1 : sum }
      milestones.length == 0 ? 0 : completed_milestones.fdiv(milestones.length)
    end

    @milestone_progress_percentage_array = @meeting.team.users.map do |user|
      weekly_milestone_progress(user)
    end
    @average_milestone_process_percentage = @milestone_progress_percentage_array.length == 0 ? 0 : (@milestone_progress_percentage_array.sum.to_f / @milestone_progress_percentage_array.length) * 100
    last_meeting_end_time = Meeting.team_meetings(@meeting.team_id).sort_by_start_time.second.end_time
    @key_activities = last_meeting_end_time.blank? ?
      KeyActivity.filter_by_team_meeting(@meeting.meeting_template_id, params[:team_id]).has_due_date.where("due_date <= ?", current_user.time_in_user_timezone.end_of_day) :
      KeyActivity.filter_by_team_meeting(@meeting.meeting_template_id, params[:team_id]).has_due_date.where(due_date: last_meeting_end_time..current_user.time_in_user_timezone.end_of_day)
    authorize @key_activities

    @issues = Issue.where(team_id: params[:team_id]).where(completed_at: current_user.time_in_user_timezone.beginning_of_day..current_user.time_in_user_timezone.end_of_day)
    authorize @issues
    render json: { milestone_progress_averages: @milestone_progress_averages, key_activities: @key_activities, issues: @issues, average_milestone_process_percentage: @average_milestone_process_percentage }
  end

  private

  def set_additional_data
    @team = @meeting.team_id ? Team.find(@meeting.team_id) : nil
    if @team.present?
      previous_week_start = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
      previous_week_end = previous_week_start + 6.days
      @current_week_average_user_emotions = @team.daily_average_users_emotion_scores_over_week(previous_week_start, previous_week_end)
      @current_week_average_team_emotions = @team.team_average_weekly_emotion_score(previous_week_start, previous_week_end)
      previous_month_start = get_beginning_of_last_month(current_user.time_in_user_timezone)
      previous_month_end = previous_month_start.end_of_month
      @current_month_average_user_emotions = @team.daily_average_users_emotion_scores_over_month(previous_month_start, previous_month_end)
      @current_month_average_team_emotions = @team.team_average_monthly_emotion_score(previous_month_start, previous_month_end)
      @previous_meeting = Meeting.where(team_id: @team.id, meeting_template_id: @meeting.meeting_template_id).second_to_last
      @emotion_score_percentage_difference = @team.compare_emotion_score(@current_week_average_team_emotions, @previous_meeting.present? && @previous_meeting.average_team_mood.present? ? @previous_meeting.average_team_mood : 0)
      @emotion_score_percentage_difference_monthly = @team.compare_emotion_score(@current_month_average_team_emotions, @previous_meeting.present? && @previous_meeting.average_team_mood.present? ? @previous_meeting.average_team_mood : 0)
      @milestones = nil
      @habits_percentage_increase_from_previous_week = nil
      @stats_for_week = nil
      @stats_for_month = nil
      @my_current_milestones = nil
    else
      #if it's Monday or Tuesday, 
      @current_week_average_user_emotions = daily_average_users_emotion_scores_over_last_week(current_user)
      @current_week_average_team_emotions = average_weekly_emotion_score_over_last_week(current_user)
      @current_month_average_user_emotions = daily_average_users_emotion_scores_over_last_month(current_user)
      @current_month_average_team_emotions = average_monthly_emotion_score_over_last_month(current_user)
      @previous_meeting = Meeting.where(hosted_by: current_user, team_id: nil, meeting_template_id: @meeting.meeting_template_id).second_to_last
      @emotion_score_percentage_difference = current_user.compare_emotion_score(@current_week_average_team_emotions, @previous_meeting.present? && @previous_meeting.average_team_mood.present? ? @previous_meeting.average_team_mood : 0)
      @emotion_score_percentage_difference_monthly = current_user.compare_emotion_score(@current_month_average_team_emotions, @previous_meeting.present? && @previous_meeting.average_team_mood.present? ? @previous_meeting.average_team_mood : 0)
      @milestones = nil
      @habits_percentage_increase_from_previous_week = current_user.habits_percentage_increase_from_previous_week
      @habits_percentage_increase_from_previous_month = current_user.habits_percentage_increase_from_previous_month
      @stats_for_week = calculate_stats_for_week(current_user)
      @stats_for_month = calculate_stats_for_month(current_user)
      @my_current_milestones = Milestone.current_week_for_user(get_next_week_or_current_week_date(current_user.time_in_user_timezone), current_user)
    end
  end

  def set_meeting
    @meeting = policy_scope(Meeting).find(params[:id])
    authorize @meeting
  end

  def meeting_params
    params.require(:meeting).permit(:id, :team_id, :meeting_template_id, :average_rating, :issues_done, :key_activities_done, :average_team_mood, :goal_progress, :start_time, :end_time, :start_time, :current_step, :host_name, :name, :notes, :settings_forum_exploration_topic, :settings_forum_exploration_topic_owner_id, :settings_forum_location, :scheduled_start_time)
  end

  def search_meeting_params
    params.permit(:team_id, :meeting_type, :fiscal_year)
  end
end