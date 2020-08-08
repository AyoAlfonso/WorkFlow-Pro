class Api::AnnualInitiativesController < Api::ApplicationController
  before_action :set_annual_initiative, only: [:show, :update, :destroy, :create_key_element]

  respond_to :json

  def create
    @annual_initiative = AnnualInitiative.new({
      created_by: current_user, 
      owned_by: current_user, 
      description: params[:description], 
      company_id: params[:type] == "company" ? current_user.company_id : nil,
      context_description: "",
      importance: ["", "", ""]
    })
    authorize @annual_initiative
    @annual_initiative.save!
    render json: { annual_initiative: @annual_initiative, status: :ok }
  end

  def show
    render json: @annual_initiative.as_json(include: [{owned_by: {methods: [:avatar_url]}}, { quarterly_goals: { include: [:milestones, owned_by: {methods: [:avatar_url]}] } }])
  end

  def update
    @annual_initiative.update!(annual_initiative_params)
    render json: { annual_initiative: @annual_initiative.as_json(include: [{owned_by: {methods: [:avatar_url]}}, { quarterly_goals: { include:[:milestones, owned_by: {methods: [:avatar_url]}] }}]), status: :ok }
  end

  def destroy
    @annual_initiative.destroy!
    render json: { annual_initiative_id: @annual_initiative.id, status: :ok }
  end

  def create_key_element
    key_element = KeyElement.create!(elementable: @annual_initiative, value: "")
    render json: { key_element: key_element, status: :ok }
  end

  private 

  def annual_initiative_params
    params.permit(:id, :created_by_id, :owned_by_id, :description, :company_id, :context_description, key_elements_attributes: [:id, :completed_at, :elementable_id, :value], :importance => [])
  end
  
  def set_annual_initiative
    @annual_initiative = policy_scope(AnnualInitiative).find(params[:id])
    authorize @annual_initiative
  end
end