class Api::CompaniesController < Api::ApplicationController
  respond_to :json

  def show
    @company = current_user.company
    authorize @company
    render json: @company.serializable_hash(only: ['id', 'name', 'phone_number', 'rallying_cry'],
    methods: ['accountability_chart_content', 'strategic_plan_content'], 
    include: {
      # accountability_chart: nil,
      # strategic_plan: nil,
      core_four: {only: ['core_1', 'core_2', 'core_3', 'core_4']}
    })
  end

end
