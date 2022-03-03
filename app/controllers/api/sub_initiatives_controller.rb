class Api::SubInitiativesController < Api::ApplicationController
  before_action :set_sub_initiative, only: [:show, :update, :destroy, :create_key_element, :update_key_element, :create_milestones, :close_goal]
  # before_action :create_milestones_for_sub_initiative, only: [:update, :create_key_element, :update_key_element ]

  respond_to :json

  def create
    
    @sub_initiative = SubInitiative.new({
      created_by: current_user,
      owned_by: current_user,
      quarterly_goal_id: params[:quarterly_goal_id],
      description: params[:description],
      context_description: "",
      importance: ["", "", ""],
    })
    authorize @sub_initiative
    @sub_initiative.save!
    render "/api/sub_initiatives/create"
  end

  def show
    render "api/sub_initiatives/show"
  end

  def update
    @sub_initiative.update!(sub_initiative_params)
    render "api/sub_initiatives/update"
  end

  def destroy
    @quarterly_goal = @sub_initiative.quarterly_goal
    @sub_initiative.destroy!
    render "api/quarterly_goals/show"
  end

  def close_goal
    @sub_initiative.update!(closed_at: Date.today)
    render "api/sub_initiatives/update"
  end

  def create_key_element
    key_element = KeyElement.create!(elementable: @sub_initiative, 
      value: params[:value], completion_type: params[:completion_type], completion_current_value: params[:completion_current_value], greater_than: params[:greater_than], 
      completion_target_value: params[:completion_target_value], owned_by_id: params[:owned_by])
    
    # ObjectiveLog.create!(objective_log_params)
    render  template: "api/key_elements/_key_element", locals: { key_element: key_element }
  end

  def update_key_element
    key_element = KeyElement.find(params[:key_element_id])
    @sub_initiative = policy_scope(SubInitiative).find(key_element.elementable_id)
    authorize @sub_initiative
    key_element.update!(value: params[:value], completion_type: params[:completion_type], greater_than: params[:greater_than], owned_by_id: params[:owned_by],
                        status: params[:status], completion_current_value: params[:completion_current_value], completion_target_value: params[:completion_target_value])
    
    # ObjectiveLog.create!(objective_log_params)
    render json: { key_element: key_element.as_json, status: :ok }

  def delete_key_element
    key_element.destroy!
    @sub_initiative = policy_scope(SubInitiative).find(key_element.elementable_id)
    @company = current_company
    authorize @sub_initiative
    render "api/sub_initiatives/delete_key_element"
  end

  def create_milestones
    create_milestones_for_sub_initiative
    render "api/sub_initiatives/create_milestones"
  end

  private
  def create_milestones_for_sub_initiative
    @sub_initiative.create_milestones_for_sub_initiative(current_user, current_company)
  end

  def sub_initiative_params
    params.permit(:id, :created_by_id, :owned_by_id, :context_description, :quarterly_goal_id, :description, key_elements_attributes: [:id, :completed_at, :elementable_id, :value, :completion_type, :completion_current_value, :completion_target_value], milestones_attributes: [:id, :description, :status], :importance => [])
  end

  def set_sub_initiative
    @sub_initiative = policy_scope(SubInitiative).find(params[:id])
    authorize @sub_initiative
  end
end
