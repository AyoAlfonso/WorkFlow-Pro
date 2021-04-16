class Api::SubInitiativesController < Api::ApplicationController
  before_action :set_sub_initiative, only: [:show, :update, :destroy, :create_key_element, :create_milestones, :close_goal]

  respond_to :json

  def create
    company = current_company

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
    render 'api/sub_initiatives/update'
  end

  def create_key_element
    key_element = KeyElement.create!(elementable: @sub_initiative, value: params[:value], completion_type: params[:completion_type], completion_current_value: params[:completion_current_value], completion_target_value: params[:completion_target_value])
    render json: { key_element: key_element, status: :ok }
  end

  def delete_key_element
    key_element = KeyElement.find(params[:key_element_id])
    key_element.destroy!
    @sub_initiative = policy_scope(SubInitiative).find(key_element.elementable_id)
    @company = current_company
    authorize @sub_initiative
    render "api/sub_initiatives/delete_key_element"
  end

  def create_milestones
    @sub_initiative.create_milestones_for_sub_initiative(current_user, current_company)
    render "api/sub_initiatives/create_milestones"
  end

  private

  def sub_initiative_params
    params.permit(:id, :created_by_id, :owned_by_id, :context_description, :quarterly_goal_id, :description, key_elements_attributes: [:id, :completed_at, :elementable_id, :value, :completion_type, :completion_current_value, :completion_target_value], milestones_attributes: [:id, :description, :status], :importance => [])
  end

  def set_sub_initiative
    @sub_initiative = policy_scope(SubInitiative).find(params[:id])
    authorize @sub_initiative
  end
end
