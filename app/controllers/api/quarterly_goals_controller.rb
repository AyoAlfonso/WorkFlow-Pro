class Api::QuarterlyGoalsController < Api::ApplicationController
  before_action :set_quarterly_goal, only: [:show, :update, :destroy, :create_key_element, :create_milestones, :close_goal]

  respond_to :json

  def index
    company_current_quarter = current_company.current_fiscal_quarter
    @quarterly_goals = policy_scope(QuarterlyGoal).owned_by_user(current_company).present_or_future(company_current_quarter).sort_by_created_date
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
      quarter: company.quarter_for_creating_quarterly_goals
    })
    authorize @quarterly_goal
    @quarterly_goal.save!
    render "/api/quarterly_goals/create"
  end

  def show
    render json: @quarterly_goal.as_json(include: [:milestones, owned_by: {methods: [:avatar_url]}])
  end

  def update
    @quarterly_goal.update!(quarterly_goal_params)
    render "api/quarterly_goals/update"
  end

  def destroy
    annual_initiative = @quarterly_goal.annual_initiative
    @quarterly_goal.destroy!
    render json: annual_initiative.as_json(include: [{owned_by: {methods: [:avatar_url]}}, { quarterly_goals: { include: [:milestones, owned_by: {methods: [:avatar_url]}] } }])
  end

  def close_goal
    @quarterly_goal.update!(closed_at: Date.today)
    render 'api/quarterly_goals/update'
  end

  def create_key_element
    key_element = KeyElement.create!(elementable: @quarterly_goal, value: params[:value], completion_type: params[:completion_type], completion_current_value: params[:completion_current_value], completion_target_value: params[:completion_target_value])
    render json: { key_element: key_element, status: :ok }
  end

  def delete_key_element
    key_element = KeyElement.find(params[:key_element_id])
    @quarterly_goal = policy_scope(QuarterlyGoal).find(key_element.elementable_id)
    authorize @quarterly_goal
    key_element.destroy!      
    render "api/quarterly_goals/delete_key_element"
  end

  def create_milestones
    @quarterly_goal.create_milestones_for_quarterly_goal(current_user, current_company)
    render "api/quarterly_goals/create_milestones"
  end

  private

  def quarterly_goal_params
    params.permit(:id, :created_by_id, :owned_by_id, :context_description, :annual_initiative_id, :description, key_elements_attributes: [:id, :completed_at, :elementable_id, :value, :completion_type, :completion_current_value, :completion_target_value], milestones_attributes: [:id, :description, :status], :importance => [])
  end

  def set_quarterly_goal
    @quarterly_goal = policy_scope(QuarterlyGoal).find(params[:id])
    authorize @quarterly_goal
  end
end
