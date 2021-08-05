class Api::ScorecardLogsController < Api::ApplicationController
  include StatsHelper
  respond_to :json
  # before_action :set_scorecard_log, only: [:show]

  def create
    @scorecard_log = ScoreCardLog.create!(scorecard_log_params)
    authorize @scorecard_log
    @scorecard_log.save!
    render json: { scorecard_log: @scorecard_log, status: :ok }
  end

  def show
    @key_performance_indicators = policy_scope(KeyPerformanceIndicator).vieweable_by_entity(params[:owner_type], params[:owner_id])
    authorize @key_performance_indicators
    @kpi = @key_performance_indicators.map do |kpi|
      @period = (kpi.scorecard_logs.empty?) ? {} : kpi.scorecard_logs.group_by(&:fiscal_year).map { |year, scorecard_log|
        [year, scorecard_log.group_by(&:week).map { |k, v| [k, v[-1]] }.to_h]
      }.to_h
      kpi.as_json.merge({ owned_by: kpi.owned_by, period: @period })
    end

    render json: { kpi: @kpi, status: :ok }
  end

  def rollup
    # TODO: Roll up function but

  end

  private

  def set_scorecard_log
  end

  def scorecard_log_params
    params.require(:scorecard_log).permit(:user_id, :score, :note, :key_performance_indicator_id, :fiscal_quarter, :fiscal_year)
  end
end
