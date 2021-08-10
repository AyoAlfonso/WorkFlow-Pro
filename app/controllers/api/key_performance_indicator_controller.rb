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
    @template_description = DescriptionTemplate.find_by(company_id: current_company.id, template_type: 0).body_content || ""
    @kpi = KeyPerformanceIndicator.new({
      created_by: current_user,
      owned_by: params[:owned_by],
      viewers: { :data => params[:data] },
      unit_type: params[:unit_type],
      target_value: params[:target_value],
      description: @template_description
    })

    authorize @kpi
    @kpi.save!
    render json: { kpi: @kpi }
  end

  def show
    @company = current_company
    render json: { kpi: @kpi }
  end

  def update
    @kpi.update!(kpi_params)
    render json: { kpi: @kpi }
  end

  def destroy
    @kpi.destroy!
    render json: { annual_initiative_id: @annual_initiative.id, status: :ok }
  end

  def close_kpi
    @kpi.update!(closed_at: Date.today)
    render json: { kpi: @kpi }
  end

  private

  def kpi_params
    params.permit(:id, :owned_by, :viewers, :description, :unit_type, :target_value)
  end

  def scorecard_log_params
    params.permit(:id, :associated_kpi_id, :score, :note)
  end

  def set_key_performance_indicator
    @kpi = policy_scope(KeyPerformanceIndicator).find(params[:id])
    authorize @kpi
  end
end
