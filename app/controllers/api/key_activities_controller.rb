class Api::KeyActivitiesController < Api::ApplicationController
  before_action :set_key_activity, only: [:update, :destroy]

  respond_to :json

  def index
    @key_activities = policy_scope(KeyActivity).owned_by_user(current_user).sort_by_position
    render "api/key_activities/index"
  end

  def create
    @key_activity = KeyActivity.new({ user_id: params[:user_id], description: params[:description], priority: params[:priority], weekly_list: params[:weekly_list], meeting_id: params[:meeting_id], due_date: params[:due_date], company_id: current_company.id, label_list: params[:label][:name] })
    authorize @key_activity
    @key_activity.insert_at(1)
    @key_activity.save!

    if params[:meeting_id]
      meeting = Meeting.find(params[:meeting_id])
      @key_activities_to_render = team_meeting_activities(params[:meeting_id]).exclude_personal_for_team(meeting.team_id)
    else
      @key_activities_to_render = policy_scope(KeyActivity).owned_by_user(current_user).sort_by_position
    end
    render "api/key_activities/create"
  end

  def update
    if params[:completed]
      # if we complete an item on the master list, it should move it to the end
      @key_activity.update!(key_activity_params.merge(completed_at: Time.now, todays_priority: false, weekly_list: false))
      @key_activity.move_to_bottom
    else
      @key_activity.update!(key_activity_params.merge(completed_at: nil))
    end

    if params[:from_team_meeting] == true
      meeting = Meeting.find(@key_activity.meeting_id)
      @key_activities_to_render = team_meeting_activities(@key_activity.meeting_id).exclude_personal_for_team(meeting.team_id)
    else
      @key_activities_to_render = policy_scope(KeyActivity).owned_by_user(current_user).sort_by_position
    end
    render "api/key_activities/update"
  end

  def destroy
    @key_activity.destroy!
    if params[:from_team_meeting] == "true"
      meeting_id = @key_activity.meeting_id
      meeting = Meeting.find(meeting_id)
      @key_activities_to_render = team_meeting_activities(meeting_id).exclude_personal_for_team(meeting.team_id)
    else
      @key_activities_to_render = policy_scope(KeyActivity).owned_by_user(current_user).sort_by_position
    end
    render "api/key_activities/destroy"
  end

  def created_in_meeting
    meeting = Meeting.find(params[:meeting_id])
    @key_activities = team_meeting_activities(meeting.id).exclude_personal_for_team(meeting.team_id)
    authorize @key_activities
    render "api/key_activities/created_in_meeting"
  end

  def resort_index
    if params[:sort].present?
      key_activities = policy_scope(KeyActivity).owned_by_user(current_user)
      @key_activities = KeyActivityResortService.call(key_activities, params[:sort])
    else
      raise "No Sort Type Given"
    end
    authorize @key_activities
    render "api/key_activities/index"
  end

  private

  def key_activity_params
    params.permit(:id, :user_id, :description, :completed_at, :priority, :complete,
      :weekly_list, :todays_priority, :position, :meeting_id, :due_date, :label_list)
  end

  def set_key_activity
    @key_activity = policy_scope(KeyActivity).find(params[:id])
    authorize @key_activity
  end

  def team_meeting_activities(meeting_id)
    meeting = Meeting.find(meeting_id)
    KeyActivity.optimized.filter_by_team_meeting(meeting.meeting_template_id, meeting.team_id).sort_by_todays_priority_weekly_list_position
  end
end
