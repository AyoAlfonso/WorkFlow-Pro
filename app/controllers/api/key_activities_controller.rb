class Api::KeyActivitiesController < Api::ApplicationController
  before_action :set_key_activity, only: [:update, :destroy]

  respond_to :json

  def index
    @key_activities = policy_scope(KeyActivity).owned_by_user(current_user).sort_by_position_priority_and_created_at
    render "api/key_activities/index"
  end

  def create
    @key_activity = KeyActivity.new({ user_id: params[:user_id], description: params[:description], priority: params[:priority], weekly_list: params[:weekly_list], meeting_id: params[:meeting_id] })
    authorize @key_activity
    @key_activity.save!

    if params[:meeting_id]
      @key_activities_to_render = team_meeting_activities(params[:meeting_id])
    else
      @key_activities_to_render = KeyActivity.owned_by_user(current_user).sort_by_priority_and_created_at
    end
    render "api/key_activities/create"
  end

  def update
    @key_activity.update!(key_activity_params.merge(completed_at: params[:completed] ? Time.now : nil))
    if params[:from_team_meeting] == "true"
      @key_activities_to_render = team_meeting_activities(@key_activity.meeting_id)
    else
      @key_activities_to_render = KeyActivity.owned_by_user(current_user).sort_by_position_priority_and_created_at
    end
    render "api/key_activities/update"
  end

  def destroy
    @key_activity.destroy!
    if params[:from_team_meeting] == "true"
      meeting_id = @key_activity.meeting_id
      @key_activities_to_render = team_meeting_activities(meeting_id)
    else
      @key_activities_to_render = KeyActivity.owned_by_user(current_user).sort_by_position_priority_and_created_at
    end
    render "api/key_activities/destroy"
  end

  def created_in_meeting
    meeting = Meeting.find(params[:meeting_id])
    @key_activities = policy_scope(KeyActivity).filter_by_team_meeting(meeting.meeting_template_id, meeting.team_id)
    authorize @key_activities
    render "api/key_activities/created_in_meeting"
  end

  private

  def key_activity_params
    params.permit(:id, :user_id, :description, :completed_at, :priority, :complete,
      :weekly_list, :todays_priority, :position, :meeting_id)
  end

  def set_key_activity
    @key_activity = policy_scope(KeyActivity).find(params[:id])
    authorize @key_activity
  end

  def team_meeting_activities(meeting_id)
    meeting = Meeting.find(meeting_id)
    KeyActivity.filter_by_team_meeting(meeting.meeting_template_id, meeting.team_id).sort_by_position_priority_and_created_at
  end


end
