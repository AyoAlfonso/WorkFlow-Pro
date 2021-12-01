class Api::KeyElementsController < Api::ApplicationController
  include StatsHelper
  respond_to :json

  def check_in_key_elements
    @quarterly_goal_key_elements = policy_scope(KeyElement).current_week_for_user(current_user, "QuarterlyGoal")
    @subinitiative_key_elements = policy_scope(KeyElement).current_week_for_user(current_user, "SubInitiative")
    @annualInitiative_key_elements = policy_scope(KeyElement).current_week_for_user(current_user, "AnnualInitiative")
    authorize @quarterly_goal_key_elements 
    authorize @subinitiative_key_elements
    authorize @annualInitiative_key_elements
    render "/api/key_elements/key_elements_for_check_in"
  end

end
