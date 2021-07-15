class Api::ScorecardsController < Api::ApplicationController
  include StatsHelper
  respond_to :json
  # before_action :set_scorecard_log, only: [:show]

  def create
    @scorecard_log = ScoreCardLog.create!(scorecard_log_params)
    authorize @scorecard_log
    @scorecard_log.save!
    render json: @scorecard_log
  end

  def show
    @key_performance_indicators = policy_scope(KeyPerformanceIndicator).where(owner_type: params[:owner_type], "#{params[:owner_type]}_id": params[:owner_id])
    authorize @key_performance_indicators
    puts @key_performance_indicators
    @kpis = @key_performance_indicators.map do |kpi|
      weeks = (kpi.scorecard_logs.group_by(&:week).empty?) ? {} : kpi.scorecard_logs.group_by(&:week).map{|k,v| [k, v[-1]]}.to_h
      user = User.find(kpi.owned_by_id)
      kpi.as_json.merge({ :weeks => weeks, :owned_by => user })
    end
    render json: @kpis
  end

  private

  def set_scorecard_log
  end

  def scorecard_log_params
    params.require(:scorecard_log).permit(:user_id, :score, :note, :key_performance_indicator_id, :fiscal_quarter, :fiscal_year)
  end
end
