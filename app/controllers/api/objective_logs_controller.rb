class Api::ObjectiveLogsController < Api::ApplicationController
  include StatsHelper
  respond_to :json
  before_action :set_objective_log, only: [:show, :destroy]

  def index
     objective_log = policy_scope(ObjectiveLog).where(objecteable_id: params[:id], objecteable_type: params[:type]).page(params[:page]).per(params[:per]).sort_by_creation_date
     render json: { objective_log: objective_log, meta: { first_page: objective_log.first_page?, prev_page: objective_log.prev_page, next_page: objective_log.next_page, current_page: objective_log.current_page, total_pages: objective_log.total_pages, total_count: objective_log.total_count, size: objective_log.size }, status: :ok }
  end 

  def create
    @objective_log = ObjectiveLog.create!(objective_log_params)
    authorize @objective_log
    @objective_log.save!
    #We want to save same values onto the Milestones that have expected week element 

    existing_milestone = Milestone.where(week: 1, milestoneable_type: params[:objecteable_type], milestoneable_id: params[:objecteable_id],
    week_of: params[:week_of])
    
    if params[:fiscal_quarter] = 1 
       week =  weeks - 13.weeks
    elsif  params[:fiscal_quarter] = 2
       week =  26.weeks
    elsif  params[:fiscal_quarter] = 3
       week =  39.weeks
    elsif params[:fiscal_quarter] = 4
        week =  52.weeks
    end

   unless existing_milestone.present?
    Milestone.create(
      milestoneable_type: params[:objecteable_type],
      milestoneable_id: params[:objecteable_id] ,
      week: week,
      week_of: params[:week_of],
      description: "",
      created_by: current_user,
    )
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
    params.permit(:owned_by_id, :score, :note, :objecteable_id, :objecteable_type, :child_id, :child_type, :fiscal_quarter, :fiscal_year, :week, :status, :created_at)
  end

end
