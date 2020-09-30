class Api::GoalsController < Api::ApplicationController
  respond_to :json

  def index
    @user_goals = policy_scope(AnnualInitiative).owned_by_user(current_user)
    @company_goals = policy_scope(AnnualInitiative).for_users_company(current_user)
    @company = Company.find(current_user.company_id)
    @personal_vision = current_user[:personal_vision]
    render 'api/goals/index'
  end
end