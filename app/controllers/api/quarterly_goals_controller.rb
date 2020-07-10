class Api::QuarterlyGoalsController < Api::ApplicationController
  before_action :set_quarterly_goal, only: [:show, :update, :destroy]

  respond_to :json

  def index
    @quarterly_goals = policy_scope(QuarterlyGoal).owned_by_user(current_user).sort_by_created_date
    render json: { quarterly_goals: @quarterly_goals, status: :ok }
  end

  def create
    @quarterly_goal = QuarterlyGoal.new(quarterly_goal_params)
    authorize @quarterly_goal
    @quarterly_goal.save!
    render json: { quarterly_goal: @quarterly_goal, status: :ok }
  end

  def show
    render json: @quarterly_goal.as_json(include: [:milestones, :owned_by])
  end

  def update
    @quarterly_goal.update!(quarterly_goal_params)
    render json: { quarterly_goal: @quarterly_goal, status: :ok }
  end

  def destroy
    @quarterly_goal.destroy!
    render json: { quarterly_goal: @quarterly_goal.id, status: :ok }
  end

  private

  def quarterly_goal_params
    params.permit(:created_by_id, :owned_by_id, :annual_initiative_id, :description, :key_elements => [], :importance => [])
  end

  def set_quarterly_goal
    @quarterly_goal = policy_scope(QuarterlyGoal).find(params[:id])
    authorize @quarterly_goal
  end
end
