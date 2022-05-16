class Api::MilestonesController < Api::ApplicationController
  include UserActivityLogHelper
  after_action :record_activities, only: [:update]
  include StatsHelper
  respond_to :json
  before_action :set_milestone, only: [:update]

  def update
    @milestone.update!(milestone_params)
    render "/api/milestones/update"
  end

  def milestones_for_meeting
    @my_current_milestones = Milestone.current_week_for_user(get_next_week_or_current_week_date(current_user.time_in_user_timezone), current_user, "QuarterlyGoal")
    authorize @my_current_milestones
    render "/api/milestones/milestones_for_meeting"
  end

  def check_in_goals
    @quarterly_goal_milestones = policy_scope(Milestone).current_week_for_user(params[:due_date].to_datetime, current_user, "QuarterlyGoal")
    @subinitiative_milestones = policy_scope(Milestone).current_week_for_user(params[:due_date].to_datetime, current_user, "SubInitiative")
    authorize @quarterly_goal_milestones 
    authorize @subinitiative_milestones
    render "/api/milestones/milestones_for_check_in"
  end

  private

  def set_milestone
    @milestone = policy_scope(Milestone).find(params[:id])
    authorize @milestone
  end

  def milestone_params
    params.require(:milestone).permit(:id, :description, :status)
  end
 
  def record_activities
    record_activity(params[:note], nil, params[:id])
  end 
end
