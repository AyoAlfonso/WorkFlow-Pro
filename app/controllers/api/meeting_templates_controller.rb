class Api::MeetingTemplatesController < Api::ApplicationController
  respond_to :json

  def index 
    @meeting_templates = policy_scope(MeetingTemplate.all)
    render json: @meeting_templates.as_json(only: [:id, :name, :meeting_type, :description], methods: [:total_duration])
  end
end