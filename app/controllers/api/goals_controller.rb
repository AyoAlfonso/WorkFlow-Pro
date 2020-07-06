class Api::GoalsController < Api::ApplicationController
  respond_to :json

  def index
    @user_goals = policy_scope(AnnualInitiative).owned_by_user(current_user).as_json(include: { quarterly_goals: { include: :milestones } })
    @company_goals = policy_scope(AnnualInitiative).for_users_company(current_user).as_json(root: true, include: { quarterly_goals: { include: :milestones } })
    @rallying_cry = Company.find(current_user.company_id)[:rallying_cry]
    render json: { 
      user: {
        personal_vision: current_user[:personal_vision],
        goals: @user_goals
      }, 
      company: {
        rallying_cry: @rallying_cry,
        goals: @company_goals
      }
    }
  end
end