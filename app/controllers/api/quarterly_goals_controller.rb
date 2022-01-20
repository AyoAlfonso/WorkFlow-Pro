class Api::QuarterlyGoalsController < Api::ApplicationController
  before_action :set_quarterly_goal, only: [:show, :update, :destroy, :create_key_element, :update_key_element, :create_milestones, :close_goal]
  before_action :create_milestones_for_quarterly_goal, only: [:update, :create_key_element, :update_key_element ]
  respond_to :json

  def index
    company_current_quarter = current_company.current_fiscal_quarter
    @quarterly_goals = policy_scope(QuarterlyGoal).owned_by_user(current_company).present_or_future_quarterly(company_current_quarter).sort_by_created_date
    render "/api/quarterly_goals/index"
  end

  def create
    company = current_company
   
    @quarterly_goal = QuarterlyGoal.new({
      created_by: current_user,
      owned_by: current_user,
      annual_initiative_id: params[:annual_initiative_id],
      description: params[:description],
      context_description: "",
      importance: ["", "", ""],
      quarter: company.quarter_for_creating_quarterly_goals,
    })
    authorize @quarterly_goal
    @quarterly_goal.save!
    create_milestones_for_quarterly_goal()
    render "/api/quarterly_goals/create"
  end

  def show
    render "api/quarterly_goals/show"
  end

  def update
    @quarterly_goal.update!(quarterly_goal_params)
    render "api/quarterly_goals/update"
  end

  def destroy
    @annual_initiative = @quarterly_goal.annual_initiative
    @quarterly_goal.destroy!
    render "api/annual_initiatives/show"
  end

  def close_goal
    @quarterly_goal.update!(closed_at: Date.today)
    @quarterly_goal.sub_initiatives.update_all(closed_at: Date.today)
    render "api/quarterly_goals/update"
  end

  def create_key_element
    #create a param validator 
    key_element = KeyElement.create!(elementable: @quarterly_goal,
                  value: params[:value], completion_type: params[:completion_type],
                  greater_than: params[:greater_than], completion_starting_value: params[:completion_starting_value],
                  completion_current_value: params[:completion_current_value], owned_by_id: params[:owned_by],
                  completion_target_value: params[:completion_target_value])
    # ObjectiveLog.create!(objective_log_params)  
    render  template: "api/key_elements/_key_element", locals: { key_element: key_element }
  end

  def update_key_element
    key_element = KeyElement.find(params[:key_element_id])
    @quarterly_goal = policy_scope(QuarterlyGoal).find(key_element.elementable_id)
    authorize @quarterly_goal
    key_element.update!(value: params[:value], completion_type: params[:completion_type], greater_than: params[:greater_than], owned_by_id: params[:owned_by],
                        status: params[:status], completion_current_value: params[:completion_current_value], completion_target_value: params[:completion_target_value])
   render template: "api/key_elements/_key_element", locals: { key_element: key_element }
  end

  def delete_key_element
    key_element = KeyElement.find(params[:key_element_id])
    @quarterly_goal = policy_scope(QuarterlyGoal).find(key_element.elementable_id)
    authorize @quarterly_goal
    key_element.destroy!
    render "api/quarterly_goals/delete_key_element"
  end

  def create_milestones
    create_milestones_for_quarterly_goal()
    render "api/quarterly_goals/create_milestones"
  end

  private

  def create_milestones_for_quarterly_goal
    @quarterly_goal.create_milestones_for_quarterly_goal(current_user, current_company)
  end

  def quarterly_goal_params
    params.permit(:id, :created_by_id, :owned_by_id, :context_description, :annual_initiative_id, :description, key_elements_attributes: [:id, :completed_at, :elementable_id, :value, :completion_type, :completion_current_value, :completion_target_value], milestones_attributes: [:id, :description, :status], :importance => [])
  end

  def key_elements_params
    params.permit(key_elements_attributes: [:id, :completed_at, :elementable_id, :value, :completion_type, :completion_current_value, :completion_target_value])
  end

  def set_quarterly_goal
    @quarterly_goal = policy_scope(QuarterlyGoal).find(params[:id])
    authorize @quarterly_goal
  end
end
