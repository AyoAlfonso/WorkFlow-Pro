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
  end

  private

  def set_scorecard_log
  end

  def scorecard_log_params
    params.require(:scorecard_log).permit(:user_id, :score, :note, :key_performance_indicator_id, :fiscal_quarter, :fiscal_year)
  end
end
