class Api::KeyPerformanceIndicatorController < ApplicationController
  before_action :set_key_performance_indicator, only: [:show, :update, :destroy, :close_kpi]

  respond_to :json¬

  def index
    @kpi = policy_scope(KeyPerformanceIndicator).where(owned_by: current_user.id)
    render json: { kpi: @kpi }
    render "/api/key_performance_indicator/index"
  end

  def create
    @kpi = KeyPerformanceIndicator.new({
              created_by: current_user,
              owned_by: params[:owned_by],
              viewers: { :data => params[:data] },
              unit_type: params[:unit_type],
              target_value: params[:target_value],
              description: params[:description],
        })

    authorize @kpi
    @kpi.save!
    #TO DO CREATE VIEWS
    render json: @kpi
    # "/api/key_performance_indicator/create"
  end

  def show
    @company = current_company
    render "api/key_performance_indicator/show"
  end

  def update
    @kpi.update!(key_performance_indicator_params)
    render json: @kpi
  end

  def destroy
    @kpi.destroy!
    render json: { annual_initiative_id: @annual_initiative.id, status: :ok }
  end

  def close_kpi
    @kpi.update!(closed_at: Date.today)
    render "api/key_performance_indicator/update"
  end

  private

  def key_performance_indicator_params
    params.permit(:id, :owned_by, :viewers, :description, :unit_type, :target_value)
  end

  def scorecard_log_params
    params.permit(:id, :associated_kpi_id, :score, :note)
  end

  def set_key_performance_indicator
    @kpi = policy_scope(KeyPerformanceIndicator).find(params[:id])
    authorize @kpi
  end
end
