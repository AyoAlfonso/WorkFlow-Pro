require 'active_support/time'

class Api::CheckInTemplatesController < Api::ApplicationController
  respond_to :json

  include UserActivityLogHelper
  respond_to :json
  after_action :record_activities, only: [:create, :update, :show]
  before_action :set_check_in_template, only: [:show, :update, :run_now, :publish_now]
  skip_after_action :verify_authorized, only: [:get_onboarding_company, :create_or_update_onboarding_goals, :get_onboarding_goals, :create_or_update_onboarding_key_activities, :get_onboarding_key_activities, :create_or_update_onboarding_team]

  def index
    @check_in_templates = policy_scope(CheckInTemplate)
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
    render json: { template: @check_in_template, status: :ok }
  end

  def publish_now
    date_time_config = @check_in_template.date_time_config
    check_in_artifacts = [];

    notification = Notification.find_or_initialize_by(
        user_id: current_user.id,
        notification_type: 7,
      )

  schedule = IceCube::Schedule.new(Time.now)
  day_as_int = IceCube::RuleHelper.day_of_week_as_int(date_time_config)
  hour_as_int = IceCube::RuleHelper.hour_of_day_as_int(date_time_config)
  minute_as_int = IceCube::RuleHelper.minute_of_hour_as_int(date_time_config)

  single_occurence_schedule = IceCube::Schedule.new(Time.new(Date.current.year, 1,1))
  run_once =  @check_in_template.run_once.to_datetime  if @check_in_template.run_once.present?

    begin
      case date_time_config["cadence"] 
        when "weekly"
           schedule.add_recurrence_rule(IceCube::Rule.weekly.day(day_as_int).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
        when "bi-weekly"
           schedule.add_recurrence_rule(IceCube::Rule.weekly(2).day(day_as_int).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
        when "daily" 
           schedule.add_recurrence_rule(IceCube::Rule.daily.hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
        when "monthly"
          schedule.add_recurrence_rule(IceCube::Rule.monthly.day(day_as_int).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
        when "once"
          single_occurence_schedule.add_recurrence_rule(IceCube::Rule.yearly.day_of_month(run_once.month).hour_of_day(run_once.hour).minute_of_hour(run_once.min))
      end
    end
      notification.attributes = {
        rule: schedule.to_hash,
        method: :email,
      }
      notification.save!
      next_start = date_time_config["cadence"] == "once" ? Time.now : Time.new(schedule.first.year, schedule.first.month, schedule.first.day, schedule.first.hour)
    if(next_start.present?)
      @check_in_template.participants.each do |person|
        if(person["type"] == "user")
          check_in_artifact = CheckInArtifact.find_or_initialize_by(check_in_template_id: @check_in_template.id, owned_by_id: person["id"])
          check_in_artifact.save!(start_time: next_start )
          check_in_artifacts << check_in_artifact
        end
      end

    @check_in_template.viewers.each do |viewer|
        if(viewer["type"]  == "user")
        check_in_artifact = CheckInArtifact.find_or_initialize_by(check_in_template_id: @check_in_template.id, owned_by_id: viewer["id"])
        check_in_artifact.save!(start_time: next_start )
        check_in_artifacts << check_in_artifact
        end

        if(viewer["type"]  == "team")
          Team.find(viewer["id"]).team_user_enablements.pluck(:user_id).each do |user|
              check_in_artifact = CheckInArtifact.find_or_initialize_by(check_in_template_id: @check_in_template.id, owned_by_id: user)
              check_in_artifact.save!(start_time: next_start)
              check_in_artifacts << check_in_artifact
          end
        end

        if(viewer["type"] == "company")
          Company.find(viewer["id"]).user_company_enablements.pluck(:user_id).each do |user|
            check_in_artifact = CheckInArtifact.find_or_initialize_by(check_in_template_id: @check_in_template.id, owned_by_id: user)
            check_in_artifact.save!(start_time: next_start)
            check_in_artifacts << check_in_artifact
          end
        end
      end
    end

   render json: {check_in_artifacts: check_in_artifacts, status: :ok }
  end

  def run_now
    if(@check_in_template.check_in_type == "dynamic") 
      check_in_artifact = CheckInArtifact.new(check_in_template: @check_in_template, owned_by: current_user)
      check_in_artifact.save!(start_time: DateTime.now.utc.beginning_of_day)
    end
    render json: {check_in_artifact: check_in_artifact, status: :ok }
  end

  def general_check_in
    check_in_artifacts = CheckInArtifact.owned_by_user(current_user).not_skipped.incomplete
    @check_in_artifacts_for_day = check_in_artifacts
    # .for_day_of_date(params[:on_day])
    # @check_in_artifacts_for_week = check_in_artifacts
    # .for_week_of_date(params[:on_week])
    # @check_in_artifacts_for_month =  check_in_artifacts
    # .for_month_of_date(params[:on_month])
     authorize @check_in_artifacts_for_day
    render json: {check_in_artifacts: @check_in_artifacts_for_day, status: :ok }

    # render "api/check_in_artifacts/general_check_in_artifacts"
  end

  def artifact

   check_in_artifact = CheckInArtifact.find(params[:id])
   @check_in_template = CheckInTemplate.find(check_in_artifact.check_in_template_id)
   date_time_config = @check_in_template.date_time_config

   schedule = IceCube::RuleHelper.construct_rule(nil, nil, nil, date_time_config["cadence"]),
   single_occurence_schedule = IceCube::Schedule.new(Time.new(Date.current.year, 1,1))
   run_once = if @check_in_template.run_once.present? Time.parse(@check_in_template.run_once) ||  Time.parse(@check_in_template.date_time_config["date"]);  end
  
    begin
      case date_time_config["cadence"] 
        when "weekly"
          rule = schedule.add_recurrence_rule(IceCube::Rule.weekly.day(date_time_config["day"]).hour_of_day(date_time_config["time"]).minute_of_hour(0)).to_h
        when "bi-weekly"
           rule = schedule.add_recurrence_rule(IceCube::Rule.weekly(2).day(date_time_config["day"]).hour_of_day(date_time_config["time"]).minute_of_hour(0)).to_h
        when "daily" 
          rule = schedule.add_recurrence_rule(IceCube::Rule.daily.hour_of_day(1).minute_of_hour()).to_h
        when "monthly"
           rule = schedule.add_recurrence_rule(IceCube::Rule.monthly.day(day_as_int).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
        when "once"
           rule = single_occurence_schedule.add_recurrence_rule(IceCube::Rule.yearly.day_of_month(run_once.month).hour_of_day(run_once.hour).minute_of_hour(run_once.min).count(1)).to_h
      end
    end

    next_start =  Time.new(rule.next_occurrence.year, rule.next_occurrence.month, rule.next_occurrence.day, rule.next_occurrence.hour)

    if(params[:skip])
      check_in_artifact.update(skip: params[:skip])
      CheckInArtifact.create!(check_in_template_id: check_in_artifact.check_in_template_id, owned_by: current_user, start_time: next_start , end_time: Time.now )
    end

    if(params[:end_now])
      check_in_artifact.update(end_time: Time.now)
      CheckInArtifact.create!(check_in_template_id: check_in_artifact.check_in_template_id, owned_by: current_user, start_time: next_start)
    end
 
    #//log artifact
  authorize check_in_artifact
  render json: {check_in_artifact: check_in_artifact, status: :ok }
  end

  def show
      render json: { template: @check_in_template, status: :ok }
  end

  def destroy
    @check_in_template.destroy!
    render json: { template: @check_in_template.id, status: :ok }
  end

  private
  # def check_in_artifact_params
  #     params.require(:check_in_artifact).permit(:name, :check_in_type, :owner_type, :description, :participants, :anonymous, :run_once, :date_time_config, :time_zone, :tag, :reminder,
  #          :check_in_templates_steps_attributes [:id, :name, :step_type, :order_index, :instructions, :duration, :component_to_render, :check_in_template_id, :image, :link_embed, :override_key, :variant, :question])
  # end

  def check_in_template_params
      params.require(:check_in_template).permit(:name, :check_in_type, :owner_type, :description, :participants, :anonymous, :run_once, :date_time_config, :time_zone, :tag, :reminder,
         :check_in_templates_steps_attributes [:id, :name, :step_type, :order_index, :instructions, :duration, :component_to_render, :check_in_template_id, :image, :link_embed, :override_key, :variant, :question], viewers: [:id, :type])
  end

  def set_check_in_template
      @check_in_template = CheckInTemplate.find(params[:id])
      authorize @check_in_template
  end

  def record_activities
        record_activity(params[:note], nil, params[:id])
  end 
end