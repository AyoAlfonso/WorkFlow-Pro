class Api::ObjectiveLogsController < Api::ApplicationController
  include StatsHelper
  respond_to :json
  before_action :set_objective_log, only: [:destroy]

  def destroy
    authorize @objective_log
    @objective_log.destroy!
    render json: { objective_log: @objective_log,  status: :ok }
  end

  private
  def set_objective_log
   @objective_log = policy_scope(ObjectiveLog).find(params[:id])
   authorize @objective_log
  end

end
