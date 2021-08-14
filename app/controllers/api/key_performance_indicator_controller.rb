class Api::KeyPerformanceIndicatorController < Api::ApplicationController
  before_action :set_key_performance_indicator, only: [:show, :update, :destroy, :close_kpi]

  respond_to :json

  def index
    @kpi = policy_scope(KeyPerformanceIndicator).where(owned_by: current_user.id)
    authorize @kpi
    render json: @kpi.as_json(except: %w[created_at updated_at],
                              methods: [:owned_by, :created_by],
                              include: {
                                scorecard_logs: { methods: [:user] },
                              })
  end

  def create
    @description = params[:description] != "" ? params[:description] : DescriptionTemplate.find_by(company_id: current_company.id, template_type: 0).body_content || ""
    @owned_by = User.find(params[:owned_by_id])
    @kpi = KeyPerformanceIndicator.new({
      created_by: current_user,
      owned_by: @owned_by,
      viewers: params[:viewers],
      unit_type: params[:unit_type],
      target_value: params[:target_value],
      greater_than: params[:greater_than],
      title: params[:title],
      description: @description,
      needs_attention_threshold: params[:needs_attention_threshold]
    })

    authorize @kpi
    @kpi.save!
    render json: { kpi: @kpi }
  end

  def show
    @company = current_company
    @period = (@kpi.scorecard_logs.empty?) ? {} : @kpi.scorecard_logs.group_by{ |log| log[:fiscal_year] }.map do |year, scorecard_log|
      [year, scorecard_log.group_by(&:week).map { |k, v| [k, v[-1]] }.to_h]
    end.to_h
    render json: { kpi: @kpi.as_json(methods: [:owned_by],
                                     include: {
                                       scorecard_logs: { methods: [:user] }
                                     }).merge({ :period => @period })}
  end

  def update
    @kpi.update!(kpi_params)
    render json: { kpi: @kpi }
  end

  def destroy
    @kpi.destroy!
    # render json: { annual_initiative_id: @annual_initiative.id, status: :ok }
  end

  def close_kpi
    @kpi.update!(closed_at: Date.today)
    render json: { kpi: @kpi }
  end

  private

  def kpi_params
    params.permit(:id, :owned_by, :viewers, :description, :unit_type, :target_value, :needs_attention_threshold)
  end

  def scorecard_log_params
    params.permit(:id, :associated_kpi_id, :score, :note)
  end

  def set_key_performance_indicator
    @kpi = policy_scope(KeyPerformanceIndicator).find(params[:id])
    authorize @kpi
  end
end
