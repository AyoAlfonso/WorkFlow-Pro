class Api::ScorecardController < Api::ApplicationController
  include StatsHelper
  respond_to :json
  before_action :set_scorecard_log, only: [:show]

  def create
    @scorecard_log = ScoreCardLog.create!(scorecard_log_params)
    authorize @scorecard_log
    @scorecard_log.save!
    render json: @scorecard_log
  end

  def show
    @company = current_company
    #TO DO
    #Considerations
    #who can see what
    #what other models are we rendering
    render "api/scorecard_logs/show"
  end

  private

  def set_scorecard_log
    kpi_id = params[:key_performance_indicator_id]
    fiscal_year = params[:fiscal_year]
    fiscal_quarter = params[:fiscal_quarter]

    @scorecard_log = policy_scope(ScoreCardLog).thirteen_weeks_of_scorecards(kpi_id, fiscal_year, fiscal_quarter)
    authorize @scorecard_log
  end

  def scorecard_log_params
    fiscal_quarter = company.current_fiscal_quarter
    fiscal_year = company.current_fiscal_year
    params.require(:scorecard_log).permit(:user_id, :score, :note, :key_performance_indicator_id, :fiscal_quarter, :fiscal_year)
  end
end
