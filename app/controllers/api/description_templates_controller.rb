class Api::DescriptionTemplatesController < Api::ApplicationController
  before_action :set_template, only: [:update, :destroy, :show]
  # before_action :prefill_template, only: [:index]
#  before_action :skip_authorization, only: :update_or_create_templates 
  respond_to :json

  def index
    @templates = policy_scope(DescriptionTemplate)
    # render "api/description_template/index"
    authorize @templates
    render json: { templates: @templates, status: :ok }
  end

  def update_or_create_templates
    DescriptionTemplate.upsert_all(params[:description_template]) if(description_template_params)
    @templates = policy_scope(DescriptionTemplate)
    authorize @templates
    render json: { templates: @templates, status: :ok }  
  end 

  def show
    # render "api/description_template/show"
    render json: { template: @template, status: :ok }
  end

  def update
    @template.update!(template_params)
    # render "api/description_template/update"
    render json: { template: @template, status: :ok }
  end

  def destroy
    @template.destroy!(template_params)
    render json: { template: @template.id, status: :ok }
  end

  def description_template_params
    params.permit(description_template: [:id, :template_type, :company_id, :title, :body, :updated_at, :created_at] )
  end

  def set_template
    @template = policy_scope(DescriptionTemplate).find(params[:id])
    authorize @template
  end
end
