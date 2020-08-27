class Api::MeetingsController < Api::ApplicationController
  before_action :set_meeting, only: [:update, :destroy, :show]

  respond_to :json

  def index 
    @meetings = policy_scope(Meeting).personal_recent_or_incomplete_for_user(current_user)
    render 'api/meetings/index'
  end

  def create 
    #TODO: replaec scope with for week or for month, etc. based on type
    incomplete_meetings_for_today = Meeting.with_template(params[:meeting_template_id]).for_day(Date.today).incomplete #TODO: VERIFY THIS WORKS OVER MIDNIGHT IN DIFFERENT TIMEZONES
    
    # @meeting = incomplete_meetings_for_today.first_or_create(meeting_params.merge({hosted_by: current_user}))
    # authorize @meeting
    # render 'api/meetings/create'

    if incomplete_meetings_for_today.incomplete.present?
      @meeting = incomplete_meetings_for_today.first
      authorize @meeting
      render 'api/meetings/create'  
    else
      @meeting = Meeting.new(meeting_params)
      @meeting.hosted_by_id = current_user.id
      authorize @meeting
      @meeting.save!
      render 'api/meetings/create'
    end
  end

  def show
    @team = Team.find(@meeting.team_id)
    one_week_ago_timezone = (current_user.time_in_user_timezone.to_date) - 1.week
    one_day_ago_timezone = (current_user.time_in_user_timezone.to_date) - 1.day
    @current_week_average_user_emotions = @team.weekly_average_users_emotion_score(one_week_ago_timezone, one_day_ago_timezone)
    @current_week_average_team_emotions = @team.team_average_weekly_emotion_score(one_week_ago_timezone, one_day_ago_timezone)
    @previous_meeting = Meeting.where(team_id: @team.id, meeting_template_id: @meeting.meeting_template_id).second_to_last
    @emotion_score_percentage_difference = @team.compare_weekly_emotion_score(@current_week_average_team_emotions, @previous_meeting.present? && @previous_meeting.average_team_mood.present? ? @previous_meeting.average_team_mood : 0)
    render 'api/meetings/show'
  end

  def update
    @meeting.update!(meeting_params)
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

  private

  def set_meeting
    @meeting = policy_scope(Meeting).find(params[:id])
    authorize @meeting
  end

  def meeting_params
    params.require(:meeting).permit(:id, :team_id, :meeting_template_id, :average_rating, :issues_done, :key_activities_done, :average_team_mood, :goal_progress, :start_time, :end_time, :scheduled_start_time, :current_step, :host_name, :name)
  end
end