class Api::GoalsController < Api::ApplicationController
  respond_to :json

  def index
    @user_goals = policy_scope(AnnualInitiative).owned_by_user(current_user).as_json(include: { quarterly_goals: { include: :milestones } })
    @company_goals = policy_scope(AnnualInitiative).for_users_company(current_user).as_json(root: true, include: { quarterly_goals: { include: :milestones } })
    render json: { user_goals: @user_goals, company_goals: @company_goals }
  end
end