class Api::ScorecardLogsController < Api::ApplicationController
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

    # //search by `user`_id will be filter users that belong to company, team and just user [which will not have any filtering]
    # //search by id of user on the owner_id
    @key_performance_indicators = policy_scope(KeyPerformanceIndicator).owned_by_entity(params[:owner_id])
    .where("owner ->> 'type' = ?", params[:owner_type])
    authorize @key_performance_indicators
    @kpi = @key_performance_indicators.map do |kpi|
      value = (kpi.scorecard_logs.group_by(&:week).empty?) ? {} : kpi.scorecard_logs.group_by(&:week).map{|k,v| [k, v[-1]]}.to_h
      kpi.as_json.merge({ :owned_by => kpi.user , :weeks => value })
    end

    render json: @kpi
  end

  private

  def set_scorecard_log
  end

  def scorecard_log_params
    params.require(:scorecard_log).permit(:user_id, :score, :note, :key_performance_indicator_id, :fiscal_quarter, :fiscal_year)
  end
end
