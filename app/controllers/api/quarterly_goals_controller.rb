class Api::QuarterlyGoalsController < Api::ApplicationController
  before_action :set_quarterly_goal, only: [:show, :update, :destroy, :create_key_element, :create_milestones]

  respond_to :json

  def index
    @quarterly_goals = policy_scope(QuarterlyGoal).owned_by_user(current_user).sort_by_created_date
    render json: { quarterly_goals: @quarterly_goals, status: :ok }
  end

  def create
    @quarterly_goal = QuarterlyGoal.new({
      created_by: current_user, 
      owned_by: current_user, 
      annual_initiative_id: params[:annual_initiative_id],
      description: params[:description],
      context_description: "",
      importance: ["", "", ""],
      quarter: current_user.company.current_fiscal_quarter #CHRIS' NOTES: Talked to Parham about this. He wants to restrict to only being able to create quarterly goals in the current quarter for now. 
    })
    authorize @quarterly_goal
    @quarterly_goal.save!
    render json: { quarterly_goal: @quarterly_goal.as_json(include: [:milestones, :owned_by]), status: :ok }
  end

  def show
    render json: @quarterly_goal.as_json(include: [:milestones, :owned_by])
  end

  def update
    @quarterly_goal.update!(quarterly_goal_params)
    render json: { quarterly_goal: @quarterly_goal.as_json(include: [:milestones, :owned_by]), status: :ok }
  end

  def destroy
    @quarterly_goal.destroy!
    render json: { quarterly_goal: @quarterly_goal.id, status: :ok }
  end

  def create_key_element
    key_element = KeyElement.create!(elementable: @quarterly_goal, value: "")
    render json: { key_element: key_element, status: :ok }
  end

  def create_milestones
    @quarterly_goal.create_milestones_for_quarterly_goal(current_user)
    render json: { quarterly_goal: @quarterly_goal.as_json(include: [:milestones, :owned_by]), status: :ok }
  end

  private

  def quarterly_goal_params
    params.permit(:id, :created_by_id, :owned_by_id, :context_description, :annual_initiative_id, :description, key_elements_attributes: [:id, :completed_at, :elementable_id, :value], milestones_attributes: [:id, :description, :status], :importance => [])
  end

  def set_quarterly_goal
    @quarterly_goal = policy_scope(QuarterlyGoal).find(params[:id])
    authorize @quarterly_goal
  end
end
