class Api::AnnualInitiativesController < Api::ApplicationController
  before_action :set_annual_initiative, only: [:show, :update, :destroy]

  respond_to :json

  def create 
    @annual_activity = AnnualInitiative.new({user: current_user, description: params[:description], importance: params[:importance], key_elements: params[:key_elements], comapny_id: current_user.company_id})
    authorize @annual_activity
    @annual_activity.save!
    render json: { annual_activity: @annual_activity, status: :ok }
  end

  def show
    render json: @annual_initiative.as_json(include: { quarterly_goals: { include:[:milestones, :owned_by] } })
  end

  def update
    @annual_initiative.update(annual_initiative_params)
    render json: { annual_initiative: @annual_initiative, status: :ok }
  end

  def destroy
    @annual_initiative.destroy!
    render json: { annual_initiative_id: @annual_initiative.id, status: :ok }
  end

  private 

  def annual_initiative_params
    params.permit(:id, :created_by_id, :owned_by_id, :importance, :description, :key_elements, :company_id)
  end
  
  def set_annual_initiative
    @annual_initiative = policy_scope(AnnualInitiative).find(params[:id])
    authorize @annual_initiative
  end
end