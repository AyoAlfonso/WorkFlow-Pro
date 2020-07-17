class Api::CompaniesController < Api::ApplicationController
  respond_to :json

  def show
    @company = current_user.company
    authorize @company
    render json: @company.serializable_hash(only: ['id', 'name', 'phone_number', 'rallying_cry'],
    methods: ['accountability_chart_content', 'strategic_plan_content'], 
    include: {
      core_four: {methods: ['core_1_content', 'core_2_content', 'core_3_content', 'core_4_content']}
    })
  end

end
