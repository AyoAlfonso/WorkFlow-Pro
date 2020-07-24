class Api::CompaniesController < Api::ApplicationController
  respond_to :json
  before_action :set_company, only: [:show, :update]

  def show
    render json: @company.serializable_hash(only: ['id', 'name', 'phone_number', 'rallying_cry', 'fiscal_year_start', 'timezone'],
    methods: ['accountability_chart_content', 'strategic_plan_content', 'logo_url'], 
    include: {
      core_four: {methods: ['core_1_content', 'core_2_content', 'core_3_content', 'core_4_content']}
    })
  end

  def update
    render json: @company.update!(company_params)
  end

  private

  def company_params
    params.permit(:name, :timezone)
  end

  def set_company
    @company = current_user.company
    authorize @company
  end

end
