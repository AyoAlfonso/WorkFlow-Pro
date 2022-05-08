class Api::KeyActivitiesController < Api::ApplicationController
  include UserActivityLogHelper
  after_action :record_activities, only: [:create, :update, :destroy, :duplicate, :created_in_meeting, :update_multiple]
  before_action :set_key_activity, only: [:update, :destroy, :duplicate]
  after_action :verify_authorized, except: [:index, :created_in_meeting, :resort_index, :update_multiple], unless: :skip_pundit?



  respond_to :json

  def index
    @key_activities = policy_scope(KeyActivity).completed_state_and_owned_by_current_user(params[:completed] == "true", current_user).sort_by_position
    render "api/key_activities/index"
  end

  
  def create
    creation_params = {
      user_id: params[:personal] ? current_user.id : params[:user_id],
      description: params[:description],
      body: params[:body],
      priority: params[:priority],
      meeting_id: params[:personal] ? nil : params[:meeting_id],
      due_date: params[:due_date],
      company_id: params[:onboarding_company_id] || current_company.id,
      personal: params[:personal],
      label_list: params[:label] && params[:label][:name],
      scheduled_group_id: params[:scheduled_group_id],
      team_id: params[:personal] ? nil : params[:team_id],
    }

    @key_activity = KeyActivity.new(creation_params)
    authorize @key_activity
    @key_activity.insert_at(1)
    @key_activity.save!

    if params[:onboarding_company_id]
      @key_activities_to_render = KeyActivity.where(company_id: params[:onboarding_company_id])
      @created_for = "onboarding"
    elsif params[:meeting_id]
      meeting = Meeting.find(params[:meeting_id])
      @key_activities_to_render = team_meeting_activities(params[:meeting_id]).exclude_personal_for_team
      @created_for = "meeting"
    else
      @key_activities_to_render = policy_scope(KeyActivity).completed_state_and_owned_by_current_user(false, current_user).sort_by_position
      @created_for = "general"
    end
    render "api/key_activities/create"
  end

  def update
    @key_activity_previously_completed = @key_activity.completed_at.present?
    merged_key_activity_params = params[:label_list].present? ? key_activity_params.merge(label_list: ActsAsTaggableOn::Tag.find(params[:label_list]) || params[:label_list]) : key_activity_params

    if params[:completed]
      # if we complete an item on the master list, it should move it to the end
      @key_activity.update!(merged_key_activity_params.merge(completed_at: Time.now, scheduled_group: ScheduledGroup.find_by_name("Backlog")))
      @key_activity.move_to_bottom
    else
      #if you move an item to todays list, it should set the moved_to_today_on
      @key_activity.update!(merged_key_activity_params.merge(completed_at: nil))
    end

    if params[:from_team_meeting] == true
      meeting = Meeting.find(@key_activity.meeting_id)
      @key_activities_to_render = team_meeting_activities(@key_activity.meeting_id).exclude_personal_for_team
      @created_for = "meeting"
    else
      @key_activities_to_render = policy_scope(KeyActivity).completed_state_and_owned_by_current_user(@key_activity_previously_completed, current_user).sort_by_position
      @created_for = "general"
    end
    render "api/key_activities/update"
  end

  def duplicate
    @new_key_activity = @key_activity.amoeba_dup
    @new_key_activity.save
    render "api/key_activities/duplicated_key_activity"
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
    @created_for = "general"
    @key_activities_to_render = policy_scope(KeyActivity).completed_state_and_owned_by_current_user(false, current_user).sort_by_position
    render "api/key_activities/update"
  end

  def destroy
    @key_activity_previously_completed = @key_activity.completed_at.present?
    # The reason we're getting the key_activity's completed_at value is because it determines which part of the front end store to update.
    # Since we are fetching completed and incompleted pyns separately, we need to know which list the pyn is being deleted from,
    # then return the proper list of pyns in order to update the front end mobx store accordingly.
    @key_activity.destroy!
    if params[:from_team_meeting] == "true"
      meeting_id = @key_activity.meeting_id
      meeting = Meeting.find(meeting_id)
      @key_activities_to_render = team_meeting_activities(meeting_id).exclude_personal_for_team
    else
      @key_activities_to_render = policy_scope(KeyActivity).completed_state_and_owned_by_current_user(@key_activity_previously_completed, current_user).sort_by_position
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
      authorize key_activities
      @key_activities = KeyActivityResortService.call(key_activities, params[:sort], params[:scheduled_group_id])
    else
      raise "No Sort Type Given"
    end
    render "api/key_activities/index"
  end

  private

  def key_activity_params
    params.permit(:id, :user_id, :description, :body, :completed_at, :priority, :complete,
                  :position, :meeting_id, :due_date, :personal, :scheduled_group_id, :team_id)
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

  def record_activities
    record_activity(params[:note])
  end 
end
