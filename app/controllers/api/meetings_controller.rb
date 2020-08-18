class Api::MeetingsController < Api::ApplicationController
  before_action :set_meeting, only: [:update, :destroy]

  response_to :json

  def index 
    @meetings = policy_scope(Meeting).all
    render json: @meetings
  end

  def create
    @meeting = Meeting.new(meeting_params)
    authorize @meeting
    @meeting.save!
    render json: { meeting: @meeting.as_json(include: { meeting_template: { include: :steps } })
  end

  def update
    @meeting.update!(meeting_params)
    render json: { meeting: @meeting.as_json(include: { meeting_template: { include: :steps } })
  end

  def destroy
    @meeting.destroy!(meeting_params)
    render json: { meeting_id: @meeting.id, status: :ok }
  end

  def current_team_meetings_in_progress
    @meetings = Meeting.team_meetings_in_progress_for_user(current_user)
    render json: { current_team_meetings: @meetings.as_json(include : { meeting_template: { include: :steps }}) }
  end

  private

  def set_meeting
    @meeting = policy_scope(Meeting).find([params[:id]])
    authorize @meeting
  end

  def meeting_params
    params.require(:meeting).permit(:id, :meeting_template_id, :average_rating, :issues_done, :key_activities_done, :average_team_mood, :goal_progress)
  end
end