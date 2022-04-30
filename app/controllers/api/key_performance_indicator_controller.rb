class Api::KeyPerformanceIndicatorController < Api::ApplicationController
  include UserActivityLogHelper
  after_action :record_activities, only: [:create, :update, :destroy]
  before_action :set_key_performance_indicator, only: [:show, :update, :destroy, :toggle_status]
 
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
    @kpi.destroy! 
    render json: { kpi: @kpi.as_json(except: %w[created_at updated_at],methods: [:owned_by]),  status: :ok }
  end

  def toggle_status
    closed_at = nil
    unless @kpi.closed_at.present? 
     closed_at = Date.today
    end
     @kpi.update!(closed_at: closed_at)
    render json: { kpi: @kpi }
  end

  private

  def kpi_params
    params.permit(:title, :id, :owned_by, :owned_by_id, :description, :greater_than, :unit_type, :needs_attention_threshold, :target_value, parent_kpi: [], viewers: [:id, :type])
  end

  def set_key_performance_indicator
    @kpi = policy_scope(KeyPerformanceIndicator).find(params[:id])
    authorize @kpi
  end
  
  def record_activities
    record_activity(params[:note])
  end 
end
