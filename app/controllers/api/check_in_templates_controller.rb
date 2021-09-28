class Api::CheckInTemplatesController < Api::ApplicationController
  respond_to :json

  def index
    @check_in_templates = policy_scope(CheckInTemplate.all)
    render json: @check_in_templates.as_json(only: [:id, :name, :check_in_type, :description], include: {
                  check_in_templates_steps: {  only: [:id, :step_type, :order_index, :name, :instructions, :component_to_render, :check_in_template_id]}})
  end
end
