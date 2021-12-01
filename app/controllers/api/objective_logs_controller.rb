class Api::ObjectiveLogsController < Api::ApplicationController
  include StatsHelper
  respond_to :json
  before_action :set_objective_log, only: [:show, :destroy]

  def index
    
  end 

  def create
    @objective_log = ObjectiveLog.create!(objective_log_params)
    authorize @objective_log
    @objective_log.save!
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
    params.permit(:owned_by_id, :score, :note, :objecteable_id, :objecteable_type, :fiscal_quarter, :fiscal_year, :week)
  end

end
