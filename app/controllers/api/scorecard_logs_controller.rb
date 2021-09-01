class Api::ScorecardLogsController < Api::ApplicationController
  include StatsHelper
  respond_to :json
  before_action :set_scorecard_log, only: [:destroy]

  def create
    @scorecard_log = ScorecardLog.create!(scorecard_log_params)
    @kpi = KeyPerformanceIndicator.find(@scorecard_log.key_performance_indicator_id)
    @period = (@kpi.scorecard_logs.empty?) ? {} : @kpi.scorecard_logs.group_by { |log| log[:fiscal_year] }.map do |year, scorecard_log|
      [year, scorecard_log.group_by(&:week).map { |k, v| [k, v[-1]] }.to_h]
    end.to_h
    authorize @scorecard_log
    @scorecard_log.save!
   
    render json: { scorecard_log: @scorecard_log,  kpi: @kpi.as_json(except: %w[created_at updated_at],methods: [:owned_by],
                                    include: {
                                    scorecard_logs: { methods: [:user] }}).merge({ :period => @period }), status: :ok }
  end

  def show
    @key_performance_indicators = policy_scope(KeyPerformanceIndicator).vieweable_by_entity(params[:owner_type], params[:owner_id])
    authorize @key_performance_indicators
    @kpis = @key_performance_indicators.map do |kpi|
      @period = (kpi.scorecard_logs.empty?) ? {} : kpi.scorecard_logs.group_by { |log| log[:fiscal_year] }.map do |year, scorecard_log|
        [year, scorecard_log.group_by(&:week).map { |k, v| [k, v[-1]] }.to_h]
      end.to_h
      kpi.as_json(methods: [:owned_by],
                  include: {
                  scorecard_logs: { methods: [:user] }}).merge({ :period => @period, :aggregrate_score => kpi.aggregrate_score })
    end

    render json: @kpis
  end

  def destroy
    kpi = KeyPerformanceIndicator.find(@scorecard_log.key_performance_indicator_id)
    authorize @scorecard_log
    @scorecard_log.destroy!
      @period = (kpi.scorecard_logs.empty?) ? {} : kpi.scorecard_logs.group_by { |log| log[:fiscal_year] }.map do |year, scorecard_log|
      [year, scorecard_log.group_by(&:week).map { |k, v| [k, v[-1]] }.to_h]
    end.to_h
    render json: { scorecard_log: @scorecard_log,  kpi: kpi.as_json(except: %w[created_at updated_at],methods: [:owned_by],
                                    include: {
                                    scorecard_logs: { methods: [:user] }}).merge({ :period => @period,:aggregrate_score => kpi.aggregrate_score  }),  status: :ok }
  end

  private
  def set_scorecard_log
   @scorecard_log = policy_scope(ScorecardLog).find(params[:id])
   authorize @scorecard_log
  end

  def scorecard_log_params
    params.require(:scorecard_log).permit(:user_id, :score, :note, :key_performance_indicator_id, :fiscal_quarter, :fiscal_year, :week)
  end
end
