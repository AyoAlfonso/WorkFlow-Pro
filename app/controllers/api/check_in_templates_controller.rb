class Api::CheckInTemplatesController < Api::ApplicationController
  respond_to :json

  include UserActivityLogHelper
  respond_to :json
  after_action :record_activities, only: [:create, :update, :show]
  before_action :set_check_in_template, only: [:show, :update]
  skip_after_action :verify_authorized, only: [:get_onboarding_company, :create_or_update_onboarding_goals, :get_onboarding_goals, :create_or_update_onboarding_key_activities, :get_onboarding_key_activities, :create_or_update_onboarding_team]

  def index
    @check_in_templates = policy_scope(CheckInTemplate.all)
    render json: @check_in_templates.as_json(only: [:id, :name, :check_in_type, :description], include: {
                  check_in_templates_steps: {  only: [:id, :step_type, :order_index, :name, :instructions, :component_to_render, :check_in_template_id]}})
  end

  def create
      @check_in_template = CheckInTemplate.create!({
          display_format: params[:display_format],
          name: params[:name],
          check_in_type: @params[:check_in_type],
          description: @params[:description],
          participants: params[:participants],
          anonymous: params[:anonymous],
          run_once: params[:run_once],
          weekly:params[:weekly],
          monthly: params[:monthly],
          quarterly: params[:quarterly],
          time_zone:params[:time_zone],
          tag:params[:tag],
          reminder: params[:reminder]
       })
      @step_atrributes = params[:check_in_template][:check_in_templates_steps_attributes]
      if @step_atrributes.present?
        @check_in_templates_steps = @step_atrributes.values
        @check_in_templates_steps.each do |step|
          CheckInTemplatesStep.create!({
            step_type: step[:step_type],
            order_index: step[:order_index],
            name: step[:name],
            instructions: step[:instructions],
            duration: step[:duration],
            component_to_render: step[:component_to_render],
            check_in_template_id: @check_in_template.id,
            image: step[:image],
            override_key: step[:override_key],
          })
        end
      end

        notification = Notification.find_or_initialize_by(
        user_id: .id,
        notification_type: v,
      )
    
        unless notification.persisted?
          notification.attributes = {
            rule: IceCube::DefaultRules.send("default_#{k}_rule"),
            method: :disabled,
          }
          notification.save
        end

    authorize @check_in_template
    render json: { templates: @check_in_template, status: :ok }
  end

  def update
     @company.update!(check_in_template_params)
  end

  private
  def check_in_template_params
      params.require(:check_in_template).permit(:name, :check_in_type, :description, check_in_templates_steps_attributes: [:id, :name, :step_type, :order_index, :instructions, :duration, :component_to_render, :check_in_template_id, :image, :link_embed, :override_key, :participants])
  end

  def set_check_in_template
      @check_in_template = CheckInTemplate.find(params[:id])
      authorize @check_in_template
  end

  def show
      render json: { templates: @check_in_template, status: :ok }
  end

  def record_activities
        record_activity(params[:note], nil, params[:id])
  end 
end 