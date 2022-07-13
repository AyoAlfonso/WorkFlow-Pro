require 'active_support/time'

class Api::CheckInTemplatesController < Api::ApplicationController
  respond_to :json

  include UserActivityLogHelper
  respond_to :json
  after_action :record_activities, only: [:create, :update, :show]
  before_action :set_check_in_template, only: [:show, :update, :run_now, :publish_now]

  skip_after_action :verify_authorized, only: [:get_onboarding_company, :create_or_update_onboarding_goals, :get_onboarding_goals, :create_or_update_onboarding_key_activities, :get_onboarding_key_activities, :create_or_update_onboarding_team]

  def index
    @check_in_templates = policy_scope(CheckInTemplate).is_parent
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
          reminder: params[:reminder],
          parent: params[:parent],
          created_by_id: current_user.id
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
    @step_atrributes = params[:check_in_templates_steps_attributes]
    if (params[:check_in_template]["participants"].present? || params[:child_check_in_template_params]["participants"].present?)
        @check_in_template.participants.each do |person|
                if(person["type"] == "user")
                  destroy_notifications(person["id"])
                end
                if(person["type"] == "team")
                    Team.find(viewer["id"]).team_user_enablements.pluck(:user_id).each do |user|
                      destroy_notifications(user)
                    end
                end
              if(person["type"] == "company")
                  Company.find(person["id"]).user_company_enablements.pluck(:user_id).each do |user|
                      destroy_notifications(user)
                  end
              end
            end
    end

   if (params[:check_in_template]["viewers"].present? || params[:child_check_in_template_params]["viewers"].present?)
          @check_in_template.viewers.each do |viewer|
            if(viewer["type"] == "user")
              destroy_notifications(viewer["id"])
            end

            if(viewer["type"] == "team")
              Team.find(viewer["id"]).team_user_enablements.pluck(:user_id).each do |user|
                destroy_notifications(user)
              end
            end

            if(viewer["type"] == "company")
                Company.find(viewer["id"]).user_company_enablements.pluck(:user_id).each do |user|
                  destroy_notifications(user)
                end
            end
          end
   end
 
    if (@check_in_template.parent.present?)
        @check_in_template.update!(child_check_in_template_params.merge(created_by_id: current_user.id))
          if @step_atrributes.present?
            @step_atrributes.each do |step|
              CheckInTemplatesStep.upsert({
                step_type: step[:step_type],
                order_index: step[:order_index],
                name: step[:name],
                instructions: step[:instructions],
                duration: step[:duration],
                component_to_render: step[:component_to_render],
                check_in_template_id: @check_in_template.id,
                variant: step[:variant],
                question:step[:question]
                }, unique_by: [:order_index, :check_in_template_id])
              end
          end
       return render json: { check_in_template: @check_in_template, status: :ok }
    elsif @check_in_template.tag.include? 'custom'
       @check_in_template.update!(custom_check_in_template_params.merge(created_by_id: current_user.id))
          if @step_atrributes.present?
              @step_atrributes.each do |step|
              CheckInTemplatesStep.upsert({
                step_type: step[:step_type],
                order_index: step[:order_index],
                name: step[:name],
                instructions: step[:instructions],
                duration: step[:duration],
                component_to_render: step[:component_to_render],
                check_in_template_id: @check_in_template.id,
                variant: step[:variant],
                question:step[:question]
                  }, unique_by: [:order_index, :check_in_template_id])
              end
          end
        return render json: { check_in_template: @check_in_template, status: :ok }
    end
  end

  def publish_now
  date_time_config = @check_in_template.date_time_config
  check_in_artifacts = [];

  schedule = IceCube::Schedule.new(Time.now)
  day_as_int = IceCube::RuleHelper.day_of_week_as_int(date_time_config)
  hour_as_int = IceCube::RuleHelper.hour_of_day_as_int(date_time_config)
  minute_as_int = IceCube::RuleHelper.minute_of_hour_as_int(date_time_config)
   day = Time.parse(date_time_config["date"]).day
    begin
      case date_time_config["cadence"] 
        when "weekly"
           schedule.add_recurrence_rule(IceCube::Rule.weekly.day(day_as_int).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
        when "bi-weekly"
           schedule.add_recurrence_rule(IceCube::Rule.weekly(2).day(day_as_int).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
        when "every-weekday"
           schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:monday, :tuesday, :wednesday, :thursday, :friday).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
        when "daily" 
           schedule.add_recurrence_rule(IceCube::Rule.daily.hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
        when "monthly"
          schedule.add_recurrence_rule(IceCube::Rule.monthly.day_of_month(day).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
        when "quarterly"
          schedule.add_recurrence_rule(IceCube::Rule.yearly.month_of_year(:march, :june, :september, :december).day_of_month(day).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
        when "once"
          run_once = @check_in_template.run_once.to_datetime  if @check_in_template.run_once.present?
          schedule.add_recurrence_rule(IceCube::Rule.yearly.day_of_month(run_once.day).hour_of_day(run_once.hour).minute_of_hour(run_once.min))
      end
    end
    
    next_start = date_time_config["cadence"] == "once" ? Time.now : Time.new(schedule.first.year, schedule.first.month, schedule.first.day, schedule.first.hour)
          if(next_start.present?)
              @check_in_template.participants.each do |person|
                if(person["type"] == "user")
                  check_in_artifact = CheckInArtifact.find_or_initialize_by(check_in_template_id: @check_in_template.id, owned_by_id: person["id"])
                  check_in_artifact.update!(start_time: next_start )
                  check_in_artifacts << check_in_artifact
                  create_notifications(person["id"], schedule)
                end

                if(person["type"] == "team")
                  Team.find(person["id"]).team_user_enablements.pluck(:user_id).each do |user|
                      check_in_artifact = CheckInArtifact.find_or_initialize_by(check_in_template_id: @check_in_template.id, owned_by_id: user)
                      check_in_artifact.update!(start_time: next_start)
                      check_in_artifacts << check_in_artifact
                      create_notifications(user, schedule)
                  end
                end

                if(person["type"] == "company")
                  Company.find(person["id"]).user_company_enablements.pluck(:user_id).each do |user|
                    check_in_artifact = CheckInArtifact.find_or_initialize_by(check_in_template_id: @check_in_template.id, owned_by_id: user)
                    check_in_artifact.update!(start_time: next_start)
                    check_in_artifacts << check_in_artifact
                    create_notifications(user, schedule)
                   end
                end
              end
          end

            @check_in_template.viewers.each do |viewer|
              if(viewer["type"] == "user")
                check_in_artifact = CheckInArtifact.find_or_initialize_by(check_in_template_id: @check_in_template.id, owned_by_id: viewer["id"])
                check_in_artifact.update!(start_time: next_start )
                check_in_artifacts << check_in_artifact
                create_notifications(viewer["id"], schedule)
              end

              if(viewer["type"] == "team")
                Team.find(viewer["id"]).team_user_enablements.pluck(:user_id).each do |user|
                    check_in_artifact = CheckInArtifact.find_or_initialize_by(check_in_template_id: @check_in_template.id, owned_by_id: user)
                    check_in_artifact.update!(start_time: next_start)
                    check_in_artifacts << check_in_artifact
                    create_notifications(user, schedule)
                end
              end

              if(viewer["type"] == "company")
                  Company.find(viewer["id"]).user_company_enablements.pluck(:user_id).each do |user|
                    check_in_artifact = CheckInArtifact.find_or_initialize_by(check_in_template_id: @check_in_template.id, owned_by_id: user)
                    check_in_artifact.update!(start_time: next_start)
                    check_in_artifacts << check_in_artifact
                    create_notifications(user, schedule)
                  end
              end
            end
  render json: {check_in_artifacts: check_in_artifacts, status: :ok }
  end

  def create_notifications(user_id,schedule ) 
    notification = Notification.find_or_initialize_by(
                user_id: user_id,
                notification_type: Notification.notification_types["dynamic_check_in"],
            )
    notification.attributes = {
      rule: schedule.to_hash,
      method: :email,
    }
    notification.save!
  end

   def destroy_notifications(user_id) 
    notification = Notification.find_or_initialize_by(
                user_id: user_id,
                notification_type: Notification.notification_types["dynamic_check_in"],
            )
    notification.destroy!
   end

  def run_now
    check_in_artifact = CheckInArtifact.new(check_in_template: @check_in_template, owned_by: current_user, start_time: Time.now.beginning_of_day)
    check_in_artifact.save!
    render json: {check_in_artifact: check_in_artifact, status: :ok }
  end

  def general_check_in
    check_in_artifacts = CheckInArtifact.owned_by_user(current_user).not_skipped.incomplete.with_parents
    @check_in_artifacts_for_day = check_in_artifacts
    # .for_day_of_date(params[:on_day])
    # @check_in_artifacts_for_week = check_in_artifacts
    # .for_week_of_date(params[:on_week])
    # @check_in_artifacts_for_month =  check_in_artifacts
    # .for_month_of_date(params[:on_month])

    # 1. If we are comfortable with a lot of logs data we can to save per step
    # 2. If we are NOT comfortable with a lot of logs we need to save at the end of process
    authorize @check_in_artifacts_for_day
    render json: {check_in_artifacts: @check_in_artifacts_for_day, status: :ok }
    # render "api/check_in_artifacts/general_check_in_artifacts"
  end

  def artifact
  check_in_artifact = CheckInArtifact.find(params[:id])
  @check_in_template = CheckInTemplate.find(check_in_artifact.check_in_template_id)
  date_time_config = @check_in_template.date_time_config

  day_as_int = IceCube::RuleHelper.day_of_week_as_int(date_time_config)
  hour_as_int = IceCube::RuleHelper.hour_of_day_as_int(date_time_config)
  minute_as_int = IceCube::RuleHelper.minute_of_hour_as_int(date_time_config)

  schedule = IceCube::Schedule.new(check_in_artifact.start_time)
  day = Time.parse(date_time_config["date"]).day if date_time_config["date"].present?
  begin
    case date_time_config["cadence"] 
      when "weekly"
          schedule.add_recurrence_rule(IceCube::Rule.weekly.day(day_as_int).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
      when "bi-weekly"
          schedule.add_recurrence_rule(IceCube::Rule.weekly(2).day(day_as_int).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
      when "every-weekday"
           schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:monday, :tuesday, :wednesday, :thursday, :friday).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
      when "daily" 
          schedule.add_recurrence_rule(IceCube::Rule.daily.hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
      when "monthly"
        schedule.add_recurrence_rule(IceCube::Rule.monthly.day_of_month(day).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
      when "quarterly"
        schedule.add_recurrence_rule(IceCube::Rule.yearly.month_of_year(:march, :june, :september, :december).day_of_month(day).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
      when "once"
        run_once = @check_in_template.run_once || Time.parse(@check_in_template.date_time_config["date"])
        schedule.add_recurrence_rule(IceCube::Rule.yearly.day_of_month(run_once.day).hour_of_day(run_once.hour).minute_of_hour(run_once.min))
    end
  end

  next_start = date_time_config["cadence"] == "once" ? Time.now : Time.new(schedule.first.year, schedule.first.month, schedule.first.day, schedule.first.hour)
    
  check_in_artifact_log = CheckInArtifactLog.find_or_initialize_by(check_in_artifact_id: check_in_artifact.id, created_by_id: current_user.id)

  if params[:scorecard_log_ids].present?
     check_in_artifact_log.attributes = {
      scorecard_logs: params[:scorecard_log_ids],
    }
  end

  if params[:objective_log_ids].present?
    check_in_artifact_log.attributes = {
    objective_logs: params[:objective_log_ids]
    }
  end

  if params[:responses].present?
     check_in_artifact_log.attributes = {
     responses: params[:responses]
    }
  end

  check_in_artifact_log.save!
  if params[:skip] == true
    check_in_artifact.update(skip: params[:skip]) 
    if(date_time_config["cadence"] != "once")
     check_in_artifact = CheckInArtifact.create!(check_in_template_id: check_in_artifact.check_in_template_id, owned_by: current_user, start_time: next_start )
    end
  elsif params[:end_now] == true
    check_in_artifact.update(end_time: Time.now.end_of_day)
    if(date_time_config["cadence"] != "once")
     check_in_artifact = CheckInArtifact.create!(check_in_template_id: check_in_artifact.check_in_template_id, owned_by: current_user, start_time: next_start)
    end
  end

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
  def custom_check_in_template_params
    params.require(:check_in_template).permit(:name, :check_in_type, :owner_type, :description, :anonymous, :run_once, :date_time_config, :time_zone, :tag, :reminder, viewers: [:id, :type], participants: [:id, :type])
  end

  def child_check_in_template_params
    params.require(:check_in_template).permit(:anonymous, :run_once, :date_time_config, :time_zone, :reminder, viewers: [:id, :type], participants: [:id, :type])
  end

  def set_check_in_template
    @check_in_template = CheckInTemplate.find(params[:id])
    authorize @check_in_template
  end

  def record_activities
    record_activity(params[:note], nil, params[:id])
  end 
end