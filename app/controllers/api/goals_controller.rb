class Api::GoalsController < Api::ApplicationController
  respond_to :json

  def index
    @company = Company.find(current_user.company_id)
    @company_current_fiscal_year = @company.current_fiscal_year
    @user_goals = policy_scope(AnnualInitiative).owned_by_user(current_user).for_company_current_year_and_future(@company_current_fiscal_year)
    @company_goals = policy_scope(AnnualInitiative).for_users_company(current_user).for_company_current_year_and_future(@company_current_fiscal_year)
    @personal_vision = current_user[:personal_vision]
    render 'api/goals/index'
  end
end