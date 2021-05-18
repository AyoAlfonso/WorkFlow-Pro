class Api::ScorecardController < Api::ApplicationController
  include StatsHelper
  respond_to :json
  before_action :set_milestone, only: [:update]

  #create a kpi score card log 
  #if anotehr is created within same week. add a new week score card log
  #Or else  m
  # i nnot 
  def update
    @milestone.update!(milestone_params)
    render '/api/scorecard_log/update'
  end

  def milestones_for_meeting
    @my_current_milestones = Milestone.current_week_for_user(get_next_week_or_current_week_date(current_user.time_in_user_timezone), current_user, "QuarterlyGoal")
    authorize @my_current_milestones
    render '/api/scorecard_log/milestones_for_meeting'
  end

  private
  def set_milestone
    @milestone = policy_scope(Milestone).find(params[:id])
    authorize @milestone
  end

  def milestone_params
    params.require(:milestone).permit(:id, :description, :status)
  end
end
