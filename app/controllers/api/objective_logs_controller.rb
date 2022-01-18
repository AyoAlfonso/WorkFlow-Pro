class Api::ObjectiveLogsController < Api::ApplicationController
  include StatsHelper
  respond_to :json
  before_action :set_objective_log, only: [:show, :destroy]

  def index
     objective_log = policy_scope(ObjectiveLog).where(objecteable_id: params[:id], objecteable_type: params[:type]).page(params[:page]).per(params[:per]).sort_by_adjusted_date
     render json: { objective_log: objective_log, meta: { first_page: objective_log.first_page?, prev_page: objective_log.prev_page, next_page: objective_log.next_page, current_page: objective_log.current_page, total_pages: objective_log.total_pages, total_count: objective_log.total_count, size: objective_log.size }, status: :ok }
  end 

  def create
    @objective_log = ObjectiveLog.create!(objective_log_params)
    authorize @objective_log
    @objective_log.save!

    if params[:fiscal_quarter] = 1 
      week = params[:week]
    elsif  params[:fiscal_quarter] = 2
      week = 13 - params[:week]
    elsif  params[:fiscal_quarter] = 3
      week = 26 -  params[:week]
    elsif params[:fiscal_quarter] = 4
      week = 39 - params[:week] 
    end
    #We want to save same values onto the Milestones that have expected week element 

  existing_milestone = Milestone.where(week: week, milestoneable_type: params[:objecteable_type], milestoneable_id: params[:objecteable_id],
    week_of: params[:week_of])

  existing_milestone.update!(status: params[:status]) if existing_milestone.present?

  unless existing_milestone.present?
    if (params[:objecteable_type] == "QuarterlyGoal")
     QuarterlyGoal.find(params[:objecteable_id]).create_milestones_for_quarterly_goal(current_user, current_company)
    #We should eagerly update the current week i.e params[:week] that is being logged
     Milestone.create_or_update(
        milestoneable_type: params[:objecteable_type],
        milestoneable_id: params[:objecteable_id] ,
        week: week,
        week_of: params[:week_of],
        status: params[:status],
        description: "",
        created_by: current_user,
        adjusted_date: params[:adjusted_date]
      )
    elsif (params[:objecteable_type] == "SubInitiative")
        SubInitiative.find(params[:objecteable_id]).create_milestones_for_sub_initiative(current_user, current_company)
        Milestone.create_or_update(
        milestoneable_type: params[:objecteable_type],
        milestoneable_id: params[:objecteable_id] ,
        week: week,
        week_of: params[:week_of],
        status: params[:status],
        description: "",
        created_by: current_user,
        adjusted_date: params[:adjusted_date]
      )
    end
  end
    render json: { objective_log: @objective_log, status: :ok }
  end
  
  def destroy
    @objective_log.destroy!
    render json: { objective_log: @objective_log,  status: :ok }
  end

  private
  def set_objective_log
   @objective_log = policy_scope(ObjectiveLog).find(params[:id])
   authorize @objective_log
  end

  def objective_log_params
    params.permit(:owned_by_id, :score, :note, :objecteable_id, :objecteable_type, :child_id, :child_type, :fiscal_quarter, :fiscal_year, :week, :status, :created_at, :adjusted_date)
  end

end
