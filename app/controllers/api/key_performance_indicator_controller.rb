class Api::KeyPerformanceIndicatorController < Api::ApplicationController
  before_action :set_key_performance_indicator, only: [:show, :update, :destroy, :close_kpi]

  respond_to :json
# TODO: Put as_json code into the kpi model 
  def index
    @key_performance_indicators = policy_scope(KeyPerformanceIndicator)
    authorize @key_performance_indicators
    @kpis = @key_performance_indicators.map do |kpi|
      kpi.as_json()
    end
    render json: @kpis
  end

  def create
    # @description = params[:description] != "" ? params[:description] : DescriptionTemplate.find_by(company_id: current_company.id, template_type: 0).body_content || ""
    @owned_by = User.find(params[:owned_by_id])
    @kpi = KeyPerformanceIndicator.new({
      title: params[:title],
      created_by: current_user,
      owned_by: @owned_by,
      company_id: current_company.id,
      viewers: params[:viewers],
      unit_type: params[:unit_type],
      target_value: params[:target_value],
      parent_type: params[:parent_type],
      parent_kpi: params[:parent_kpi] || [],
      description: params[:description],
      greater_than: params[:greater_than],
      needs_attention_threshold: params[:needs_attention_threshold],
    })

    authorize @kpi
    @kpi.save!
   render json: { kpi: @kpi.as_json() }
  end

  def show
    @company = current_company
    render json: { kpi: @kpi.as_json() }
  end

  def update
    @kpi.update!(kpi_params)
    render json: { kpi: @kpi.as_json() }
  end

  def destroy
    @kpi.scorecard_logs.destroy_all
    @kpi.destroy! 
    render json: { kpi: @kpi.as_json(except: %w[created_at updated_at],methods: [:owned_by]),  status: :ok }
  end

  def close_kpi
    @kpi.update!(closed_at: Date.today)
    render json: { kpi: @kpi }
  end

  private

  def kpi_params
    params.permit(:title, :id, :owned_by, :owned_by_id, :description, :unit_type, :target_value, :needs_attention_threshold, viewers: [:id, :type])
  end

  def scorecard_log_params
    params.permit(:id, :associated_kpi_id, :score, :note)
  end

  def set_key_performance_indicator
    @kpi = policy_scope(KeyPerformanceIndicator).find(params[:id])
    authorize @kpi
  end
end
