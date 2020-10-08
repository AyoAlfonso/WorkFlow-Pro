class Api::KeyActivitiesController < Api::ApplicationController
  before_action :set_key_activity, only: [:update, :destroy]

  respond_to :json

  def index
    @key_activities = policy_scope(KeyActivity).owned_by_user(current_user).sort_by_todays_priority_weekly_list_position
    render "api/key_activities/index"
  end

  def create
    @key_activity = KeyActivity.new({ user_id: params[:user_id], description: params[:description], priority: params[:priority], weekly_list: params[:weekly_list], meeting_id: params[:meeting_id] })
    # if its a master list acitivity item, insert after the last noncompleted item
    if params[:weekly_list] == false
      list_of_key_activities = KeyActivity.owned_by_user(current_user).master_list.incomplete.sort_by_todays_priority_weekly_list_position
      if list_of_key_activities.length == 0
        @key_activity.insert_at(1)
      else
        @key_activity.insert_at(list_of_key_activities.last.position + 1)
      end
    end
    authorize @key_activity
    @key_activity.save!

    if params[:meeting_id]
      @key_activities_to_render = team_meeting_activities(params[:meeting_id])
    else
      @key_activities_to_render = KeyActivity.optimized.owned_by_user(current_user).sort_by_priority_and_created_at
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
      @key_activities_to_render = team_meeting_activities(@key_activity.meeting_id)
    else
      @key_activities_to_render = KeyActivity.optimized.owned_by_user(current_user).sort_by_todays_priority_weekly_list_position
    end
    render "api/key_activities/update"
  end

  def destroy
    @key_activity.destroy!
    if params[:from_team_meeting] == "true"
      meeting_id = @key_activity.meeting_id
      @key_activities_to_render = team_meeting_activities(meeting_id)
    else
      @key_activities_to_render = KeyActivity.optimized.owned_by_user(current_user).sort_by_todays_priority_weekly_list_position
    end
    render "api/key_activities/destroy"
  end

  def created_in_meeting
    meeting = Meeting.find(params[:meeting_id])
    @key_activities = team_meeting_activities(meeting.id)
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
    KeyActivity.optimized.filter_by_team_meeting(meeting.meeting_template_id, meeting.team_id).sort_by_todays_priority_weekly_list_position
  end


end
