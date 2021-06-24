class Api::KeyPerformanceIndicatorController < ApplicationController
  before_action :set_key_performance_indicator, only: [:show, :update, :destroy, :close_kpi]

  respond_to :json

  def index
    #Get all the kpi's
    #Get by company, by team and by individual
    @kpi = policy_scope(KeyPerformanceIndicator)
    render json: { kpi: @kpi }
    render "/api/key_performance_indicator/index"
  end

  def create
    @kpi = KeyPerformanceIndicator.new({
      created_by: current_user, 
      owned_by: current_user, 
      unit_type: params[:unit_type],
      quarter: company.quarter_for_creating_quarterly_goals,
      description: params[:description]
    })

    authorize @kpi
    @kpi.save!
    #TO DO CREATE VIEWS
    render "/api/key_performance_indicator/create"
  end

  def create_scorecard_logs
    scorecard_log = ScoreCardLog.create!(scorecard_log_params)
    render json: { scorecard_log: scorecard_log, status: :ok }
  end

  def show
    @company = current_company
    render "api/key_performance_indicator/show"
  end

  def update
    @kpi.update!(key_performance_indicator_params)
    render json: @habit
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
    params.permit(:id, :created_by_id, :owned_by_id, :description, :unit_type)
  end

  def scorecard_log_params
    params.permit(:id, :associated_kpi_id, :score, :created_by_id, :note)
  end

  def set_key_performance_indicator
    @kpi = policy_scope(KeyPerformanceIndicator).find(params[:id])
    authorize @kpi
  end
end
