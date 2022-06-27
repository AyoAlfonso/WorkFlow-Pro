class Api::CheckInTemplatesController < Api::ApplicationController
  respond_to :json

  include UserActivityLogHelper
  respond_to :json
  after_action :record_activities, only: [:create, :update, :show]
  before_action :set_check_in_template, only: [:show, :update, :run_now, :publish_now]
  skip_after_action :verify_authorized, only: [:get_onboarding_company, :create_or_update_onboarding_goals, :get_onboarding_goals, :create_or_update_onboarding_key_activities, :get_onboarding_key_activities, :create_or_update_onboarding_team]

  def index
    @check_in_templates = policy_scope(CheckInTemplate) ##squash the  check-in template  and run migration
    render json: @check_in_templates.as_json(only: [:id, :name, :check_in_type, :owner_type, :description, :participants, :anonymous, :run_once, :date_time_config, :time_zone, :tag, :reminder], include: {
                  check_in_templates_steps: {  only: [:id, :name, :step_type, :order_index, :instructions, :duration, :component_to_render, :check_in_template_id, :image, :link_embed, :override_key, :variant, :question]}})
  end

  def create
      @check_in_template = CheckInTemplate.create!({
          name: params[:name],
          check_in_type: params[:check_in_type],
          owner_type: params[:owner_type],
          company_id: current_company.id,
          description: params[:description],
          viewers: params[:viewers],
          participants: params[:participants],
          anonymous: params[:anonymous],
          run_once: params[:run_once],
          date_time_config: params[:date_time_config],
          time_zone:params[:time_zone],
          tag:params[:tag],
          reminder: params[:reminder]
       })

      @step_atrributes = params[:check_in_template][:check_in_templates_steps_attributes]
      if @step_atrributes.present?
        @step_atrributes.each do |step|
          CheckInTemplatesStep.create!({
            step_type: step[:step_type],
            order_index: step[:order_index],
            name: step[:name],
            instructions: step[:instructions],
            duration: step[:duration],
            component_to_render: step[:component_to_render],
            check_in_template_id: @check_in_template.id,
            variant: step[:variant],
            question:step[:question]
          })
        end
      end

    authorize @check_in_template
    render json: { template: @check_in_template, status: :ok }
  end

  def update
     @check_in_template.update!(check_in_template_params)
  end

  def publish_now
    date_time_config = @check_in_template.date_time_config
    check_in_artifact = CheckInArtifact.new(check_in_template_id: @check_in_template.id, owned_by: current_user)
    
    notification = Notification.find_or_initialize_by(
        user_id: current_user.id,
        notification_type: 7,
      )

  schedule = IceCube::Schedule.new(Time.current - 7.days)
  single_occurence_schedule = IceCube::Schedule.new(Time.new(Date.current.year, 1,1))
  run_once  =  if @check_in_template.run_once.present? Time.parse(@check_in_template.run_once) ||  Time.parse(@check_in_template.date_time_config["date"])
  begin
    case date_time_config["cadence"] 
      when "weekly"; rule = schedule.add_recurrence_rule(IceCube::Rule.weekly.day(date_time_config["day"]).hour_of_day(10).minute_of_hour(0)).to_h
      when "bi-weekly"; rule = schedule.add_recurrence_rule(IceCube::Rule.weekly(2).day(date_time_config["day"]).hour_of_day(10).minute_of_hour(0)).to_h
      when "daily"; rule = schedule.add_recurrence_rule(IceCube::Rule.daily.hour_of_day(10).minute_of_hour(0)).to_h
      when "monthly"; rule = schedule.add_recurrence_rule(IceCube::Rule.monthly.day(date_time_config["day"]).hour_of_day(10).minute_of_hour(0)).to_h
      when "yearly";  rule = single_occurence_schedule.add_recurrence_rule(IceCube::Rule.yearly.day_of_month(run_once.month).hour_of_day(run_once.hour).minute_of_hour(run_once.min).count(1)).to_h
    end

  unless notification.persisted?
    notification.attributes = {
      rule: rule,
      method: :enabled,
    }
    notification.save!
    next_start =  Time.new(rule.next_occurrence.year, rule.next_occurrence.month, rule.next_occurrence.day, rule.next_occurrence.hour)
    check_in_artifact.save!(start_time: next_start, end_time: DateTime.now.utc.end_of_day)

  end

  def run_now
    if(@check_in_template.check_in_type == "dynamic") 
      check_in_artifact = CheckInArtifact.new(check_in_template_id: @check_in_template.id, owned_by: current_user)
      check_in_artifact.save!(start_time: DateTime.now.utc.beginning_of_day)
    end
     render json: { template: @check_in_template, status: :ok }
  end

  def general_check_in
  check_in_artifacts =  CheckInArtifact.where(owned_by: current_user, skip: false).incomplete
  @check_in_artifacts_for_day = check_in_artifacts.for_day_of_date(params[:on_day])
  @check_in_artifacts_for_week = check_in_artifacts.for_week_of_date(params[:on_week])
  @check_in_artifacts_for_month =  check_in_artifacts.for_month_of_date(params[:on_month])
  render "api/check_in_artifacts/general_check_in_artifacts"
  end

  def artifact_check_in
   check_in_artifact = CheckInArtifact.find(params[:id])
    if(params[:skip])
      check_in_artifact.update(skip: params[:skip], end_time: Time.now )
      CheckInArtifact.create!(check_in_template_id: check_in_artifact.check_in_template_id, owned_by: current_user, start_time: DateTime.now.utc.beginning_of_day, end_time: DateTime.now.utc.end_of_day )
    end

  end

  def destroy
    @check_in_template.destroy!
    render json: { template: @check_in_template.id, status: :ok }
  end

  private
  def check_in_template_params
      params.require(:check_in_template).permit(:name, :check_in_type, :owner_type, :description, :participants, :anonymous, :run_once, :date_time_config, :time_zone, :tag, :reminder,
             :check_in_templates_steps_attributes [:id, :name, :step_type, :order_index, :instructions, :duration, :component_to_render, :check_in_template_id, :image, :link_embed, :override_key, :variant, :question])
  end

  def set_check_in_template
      @check_in_template = CheckInTemplate.find(params[:id])
      authorize @check_in_template
  end

  

  def show
      render json: { template: @check_in_template, status: :ok }
  end

  def record_activities
        record_activity(params[:note], nil, params[:id])
  end 
end 