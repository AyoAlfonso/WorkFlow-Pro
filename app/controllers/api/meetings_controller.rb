class Api::MeetingsController < Api::ApplicationController
  response_to :json

  def create
    @meeting = Meeting.new(meeting_params)
    authorize @meeting
    @meeting.save!
    render json: @meeting.as_json
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