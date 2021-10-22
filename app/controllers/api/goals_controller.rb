class Api::GoalsController < Api::ApplicationController
  include StatsHelper
  respond_to :json

  def index
    @company = Company.find(current_company.id)
    @company_current_fiscal_year = @company.current_fiscal_year
    get_user_goals
    get_company_goals
    @personal_vision = current_user[:personal_vision]
    render "api/goals/index"
  end

  private  
  def get_user_goals
    @user_goals = policy_scope(AnnualInitiative).owned_by_user(current_user).order(created_at: :desc) #.for_company_current_year_and_future(@company_current_fiscal_year)
    authorize @user_goals
  end

  def get_company_goals
    @company_goals = policy_scope(AnnualInitiative).user_current_company(current_company.id).order(created_at: :desc) #.for_company_current_year_and_future(@company_current_fiscal_year)
    authorize @company_goals
  end

end
