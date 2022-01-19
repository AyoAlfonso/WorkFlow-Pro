class Api::AnnualInitiativesController < Api::ApplicationController
  before_action :set_annual_initiative, only: [:show, :update, :destroy, :create_key_element, :update_key_element,
                                               :close_initiative]

  respond_to :json

  def create
    @annual_initiative = AnnualInitiative.new({
      created_by: current_user, owned_by: current_user,
      description: params[:description],
      company_id: params[:type] == "company" ? current_company.id : nil,
      context_description: "", importance: ["", "", ""],
      fiscal_year: current_company.year_for_creating_annual_initiatives,
    })
    authorize @annual_initiative
    @annual_initiative.save!
    render json: { annual_initiative: @annual_initiative, status: :ok }
  end

  def show
    @company = current_company
    render "api/annual_initiatives/show"
  end

  def update
    @company = current_company
    @annual_initiative.update!(annual_initiative_params)
    render "api/annual_initiatives/update"
  end

  def destroy
    @annual_initiative.destroy!
    render json: { annual_initiative_id: @annual_initiative.id, status: :ok }
  end

  def close_initiative
    @company = current_company
    @annual_initiative.update!(closed_at: Date.today)
    @annual_initiative.quarterly_goals.update_all(closed_at: Date.today)
    @annual_initiative.sub_initiatives.update_all(closed_at: Date.today)
    render "api/annual_initiatives/update"
  end

  def create_key_element
    key_element = KeyElement.create!(elementable: @annual_initiative, 
                  value: params[:value], completion_type: params[:completion_type],
                  greater_than: params[:greater_than], completion_starting_value: params[:completion_starting_value],
                  owned_by_id: params[:owned_by], completion_current_value: params[:completion_current_value],
                  completion_target_value: params[:completion_target_value])
    # ObjectiveLog.create!(objective_log_params)
    #MERGE IN MODEL
    render json: { key_element: key_element.as_json,  status: :ok }
  end

  def update_key_element
    key_element = KeyElement.find(params[:key_element_id])
    @annual_initiative = policy_scope(AnnualInitiative).find(key_element.elementable_id)
    authorize @annual_initiative
    key_element.update!(value: params[:value], completion_type: params[:completion_type], greater_than: params[:greater_than], owned_by_id: params[:owned_by],
                        status: params[:status], completion_current_value: params[:completion_current_value], completion_target_value: params[:completion_target_value])
  
    render  template: "api/key_elements/_key_element", locals: { key_element: key_element }
  end

  def delete_key_element
    key_element = KeyElement.find(params[:key_element_id])
    key_element.destroy!
    @annual_initiative = policy_scope(AnnualInitiative).find(key_element.elementable_id)
    @company = current_company
    authorize @annual_initiative
    render "api/annual_initiatives/delete_key_element"
  end

  def team
    @team_id = params[:team_id]
    @company = current_company
    @annual_initiatives = policy_scope(AnnualInitiative).user_current_company(current_company.id).order(fiscal_year: :desc)  #.for_company_current_year_and_future(@company.current_fiscal_year)        
    authorize @annual_initiatives
    render "api/annual_initiatives/team"
  end

  private

  def annual_initiative_params
    params.permit(:id, :created_by_id, :owned_by_id, :description, :company_id, :context_description, key_elements_attributes: [:id, :completed_at, :elementable_id, :value, :completion_type, :completion_starting_value, :completion_current_value, :completion_target_value], :importance => [])
  end

  def key_elements_params
    params.permit(key_elements_attributes: [:id, :completed_at, :elementable_id, :value, :completion_type, :completion_current_value, :completion_target_value])
  end

  def set_annual_initiative
    @annual_initiative = policy_scope(AnnualInitiative).find(params[:id])
    authorize @annual_initiative
  end
end
