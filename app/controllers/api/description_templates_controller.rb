class Api::DescriptionTemplatesController < Api::ApplicationController
  include UserActivityLogHelper
  after_action :record_activities, only: [:update_or_create_templates, :update_template_body, :destroy]
  before_action :set_template, only: [:update, :destroy, :show]
  respond_to :json

  def index
    @templates = policy_scope(DescriptionTemplate)
    # render "api/description_template/index"
    authorize @templates
    render json: { templates: @templates, status: :ok }
  end

  def update_or_create_templates
    DescriptionTemplate.upsert_all(params[:description_template]) if (description_template_params)
    @templates = policy_scope(DescriptionTemplate)
    authorize @templates
    render json: { templates: @templates, status: :ok }
  end

  def show
    # render "api/description_template/show"
    render json: { template: @template, status: :ok }
  end

  def update_template_body
    Company.find(current_company.id).update!(company_attributes_params)
    @templates = policy_scope(DescriptionTemplate)
    authorize @templates
    render json: { template: @templates, status: :ok }
  end

  def destroy
    @template.destroy!(template_params)
    render json: { template: @template.id, status: :ok }
  end

  def company_attributes_params
    #user should not be allowed to update the display_format once created
    params.permit(description_templates_attributes: [:id, :title, :body])
  end

  def description_template_params
    params.permit(description_template: [:id, :template_type, :company_id, :title, :updated_at, :created_at])
  end

  def set_template
    @template = policy_scope(DescriptionTemplate).find(params[:id])
    authorize @template
  end

  def record_activities
       record_activity(params[:note], nil, params[:id])
  end 
end
