class Api::KeyElementController < Api::ApplicationController
  include StatsHelper
  respond_to :json

  def check_in_key_results
    @quarterly_goal_key_results = policy_scope(KeyElement).current_week_for_user(params[:due_date].to_datetime, current_user, "QuarterlyGoal")
    @subinitiative_key_results = policy_scope(KeyElement).current_week_for_user(params[:due_date].to_datetime, current_user, "SubInitiative")
    @annualInitiative_key_results = policy_scope(KeyElement).current_week_for_user(params[:due_date].to_datetime, current_user, "AnnualInitiative")
    authorize @quarterly_goal_key_results 
    authorize @subinitiative_key_results
    authorize @annualInitiative_key_results
    render "/api/key_results/key_results_for_check_in"
  end

end
