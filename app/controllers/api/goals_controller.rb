class Api::GoalsController < Api::ApplicationController
  include StatsHelper
  respond_to :json

  def index
    @company = Company.find(current_company.id)
    @company_current_fiscal_year = @company.current_fiscal_year
    # binding.pry
    @goals = policy_scope(AnnualInitiative)
    if params[:status] == "closed"
      @goals = policy_scope(AnnualInitiative).sort_by_closed_at
    elsif params[:status] == "open"
      @goals = policy_scope(AnnualInitiative).sort_by_not_closed_at
    end
    
    @user_goals = @goals.owned_by_user(current_user).order(created_at: :desc)

    @goals = policy_scope(AnnualInitiative)
    if params[:status] == "closed"
      @goals = policy_scope(AnnualInitiative).sort_by_closed_at
    elsif params[:status] == "open"
      @goals = policy_scope(AnnualInitiative).sort_by_not_closed_at
    end
    @company_goals = @goals.user_current_company(current_company.id).order(created_at: :desc)
    
    authorize @user_goals
    authorize @company_goals

    @personal_vision = current_user[:personal_vision]
    render "api/goals/index"
  end
end
