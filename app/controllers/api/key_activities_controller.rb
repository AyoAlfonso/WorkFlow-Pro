class Api::KeyActivitiesController < Api::ApplicationController
  before_action :set_key_activity, only: [:update, :destroy]

  after_action :verify_authorized, except: [:index, :created_in_meeting, :resort_index, :update_multiple], unless: :skip_pundit?

  respond_to :json

  def index
    @key_activities = policy_scope(KeyActivity).owned_by_user(current_user).sort_by_position
    render "api/key_activities/index"
  end

  def create
    @key_activity = KeyActivity.new({ user_id: params[:user_id], description: params[:description], priority: params[:priority], meeting_id: params[:meeting_id], due_date: params[:due_date], company_id: params[:onboarding_company_id] || current_company.id, personal: params[:personal], label_list: params[:label] && params[:label][:name], scheduled_group_id: params[:scheduled_group_id], team_id: params[:team_id] })
    authorize @key_activity
    @key_activity.insert_at(1)
    @key_activity.save!

    if params[:onboarding_company_id]
      @key_activities_to_render = KeyActivity.where(company_id: params[:onboarding_company_id])
    elsif params[:meeting_id]
      meeting = Meeting.find(params[:meeting_id])
      @key_activities_to_render = team_meeting_activities(params[:meeting_id]).exclude_personal_for_team
    else
      @key_activities_to_render = policy_scope(KeyActivity).owned_by_user(current_user).sort_by_position
    end
    render "api/key_activities/create"
  end

  def update
    if params[:completed]
      # if we complete an item on the master list, it should move it to the end
      @key_activity.update!(key_activity_params.merge(completed_at: Time.now, scheduled_group: ScheduledGroup.find_by_name("Backlog")))
      @key_activity.move_to_bottom
    else
      #if you move an item to todays list, it should set the moved_to_today_on
      @key_activity.update!(key_activity_params.merge(completed_at: nil))
    end

    if params[:from_team_meeting] == true
      meeting = Meeting.find(@key_activity.meeting_id)
      @key_activities_to_render = team_meeting_activities(@key_activity.meeting_id).exclude_personal_for_team
    else
      @key_activities_to_render = policy_scope(KeyActivity).owned_by_user(current_user).sort_by_position
    end
    render "api/key_activities/update"
  end

  def update_multiple
    #take in a list of key activity ids, update them and return all back to the front end
    if key_activities_params[:completed]
      completed_at = Time.now
      scheduled_group = ScheduledGroup.find_by_name("Backlog")
      policy_scope(KeyActivity).where(id: key_activities_params[:ids_to_update].split(",")).each do |key_activity|
        key_activity.update!(completed_at: completed_at, scheduled_group: scheduled_group)
        key_activity.move_to_bottom
      end
      #TODO: need to do move to bottom on mass update, for now we just loop for simplicty sake
      #policy_scope(KeyActivity).where(id: key_activities_params[:ids_to_update]).update_all(completed_at: Time.now, scheduled_group: ScheduledGroup.find_by_name("Backlog"))
    else
      #todo, work on mass moving back to incomplete state?
    end

    @key_activities_to_render = policy_scope(KeyActivity).owned_by_user(current_user).sort_by_position
    render "api/key_activities/update"
  end

  def destroy
    @key_activity.destroy!
    if params[:from_team_meeting] == "true"
      meeting_id = @key_activity.meeting_id
      meeting = Meeting.find(meeting_id)
      @key_activities_to_render = team_meeting_activities(meeting_id).exclude_personal_for_team
    else
      @key_activities_to_render = policy_scope(KeyActivity).owned_by_user(current_user).sort_by_position
    end
    render "api/key_activities/destroy"
  end

  def created_in_meeting
    meeting = Meeting.find(params[:meeting_id])
    @key_activities = team_meeting_activities(meeting.id).exclude_personal_for_team
    authorize @key_activities
    render "api/key_activities/created_in_meeting"
  end

  def resort_index
    #currently you cannot sort if it is for a team so a scheudled group id must be present
    if params[:sort].present? && params[:scheduled_group_id].present?
      key_activities = policy_scope(KeyActivity).owned_by_user(current_user)
      @key_activities = KeyActivityResortService.call(key_activities, params[:sort], params[:scheduled_group_id])
    else
      raise "No Sort Type Given"
    end
    authorize @key_activities
    render "api/key_activities/index"
  end

  private

  def key_activity_params
    params.permit(:id, :user_id, :description, :completed_at, :priority, :complete,
      :position, :meeting_id, :due_date, :personal, :scheduled_group_id, :team_id, :label_list)
  end

  def key_activities_params
    params.permit(:ids_to_update, :completed)
  end

  def set_key_activity
    @key_activity = policy_scope(KeyActivity).find(params[:id])
    authorize @key_activity
  end

  def team_meeting_activities(meeting_id)
    meeting = Meeting.find(meeting_id)
    KeyActivity.optimized.filter_by_team_meeting(meeting.meeting_template_id, meeting.team_id).sort_by_progressing_non_backlog_position
  end
end
