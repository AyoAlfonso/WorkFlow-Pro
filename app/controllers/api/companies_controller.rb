class Api::CompaniesController < Api::ApplicationController
  respond_to :json
  before_action :set_company, only: [:show, :update, :update_logo, :delete_logo]

  def show
    render json: @company.as_json(only: ['id', 'name', 'phone_number', 'rallying_cry', 'fiscal_year_start', 'timezone', 'display_format'],
    methods: ['accountability_chart_content', 'strategic_plan_content', 'logo_url', 'current_fiscal_quarter', 'quarter_for_creating_quarterly_goals', 'current_fiscal_year', 'year_for_creating_annual_initiatives', 'fiscal_year_range', 'current_quarter_start_date', 'next_quarter_start_date', 'forum_meetings_year_range', 'forum_intro_video'], 
    include: {
      core_four: {methods: ['core_1_content', 'core_2_content', 'core_3_content', 'core_4_content']}
    })
  end

  def update
    @company.update!(company_params)
    render json: @company.as_json(only: ['id', 'name', 'phone_number', 'rallying_cry', 'fiscal_year_start', 'timezone', 'display_format'],
    methods: ['accountability_chart_content', 'strategic_plan_content', 'logo_url', 'current_fiscal_quarter', 'quarter_for_creating_quarterly_goals', 'current_fiscal_year', 'year_for_creating_annual_initiatives', 'fiscal_year_range', 'current_quarter_start_date', 'next_quarter_start_date', 'forum_meetings_year_range', 'forum_intro_video'], 
    include: {
      core_four: {methods: ['core_1_content', 'core_2_content', 'core_3_content', 'core_4_content']}
    })
  end

  def update_logo
    @company.logo.attach(params[:logo])
    render json: { logo_url: @company.logo_url }
  end

  def delete_logo
    @company.logo.purge_later
    render json: {logo_url: nil }
  end

  private

  def company_params
    #user should not be allowed to update the display_format once created
    params.require(:company).permit(:name, :timezone, :logo, :rallying_cry, core_four_attributes: [:core_1, :core_2, :core_3, :core_4])
  end

  # def new_company_params
  #   when creating the company, allow the creation of a display_format
  #   company_params
  # end

  def set_company
    @company = params[:id] == "default" ? current_company : Company.find(params[:id])
    authorize @company
  end

end
