class AddStatusToCheckInTemplates < ActiveRecord::Migration[6.1]
  def change
    add_column :check_in_templates, :status, :integer, default: 0
  end

  def data
    CheckInTemplate.all.each do |template|
      if template.check_in_type == 1 && template.related_parent&.length > 0 
         template.status = 1
         template.save
      end
    end
    Notification.where(notification_type: 6).each do |notification|
      notification.destroy
    end

    old_weekly_check_in_template = CheckInTemplate.where(check_in_type: 0).first
    
    Company.all.each do |current_company|
    company_users = Company.find(current_company.id).user_company_enablements.pluck(:user_id)
    company_admin_users = Company.find(current_company.id).user_company_enablements.where(user_role: 2).pluck(:user_id)
    notifications = Notification.where(notification_type: 5, user_id: company_users)

    validation_rule = notifications.first.rule["rrules"][0]["validations"] if notifications.length > 0

      if validation_rule
        hour = validation_rule["hour_of_day"][0]
        minute = validation_rule["minute_of_hour"][0]
        day = validation_rule["day"][0]
        
        @check_in_template = CheckInTemplate.create!({
              name: "Weekly Checkin",
              check_in_type: 1,
              owner_type: 0,
              company_id: current_company.id,
              description: "",
              viewers: [{type: "company", id: current_company.id }],
              participants:  [{type: "company", id: current_company.id }],
              anonymous: false,
              date_time_config: {day: day, date: "", time: "#{hour}:#{minute}", cadence: "Weekly"},
              time_zone: 0,
              tag: ["global"],
              reminder: {unit: "day", value: 1},
              parent: nil,
              created_by_id: company_admin_users.first
          })
    
          old_weekly_check_in_template.check_in_templates_steps.each do |step|
              CheckInTemplatesStep.create!({
                  step_type: step.step_type,
                  order_index: step.order_index,
                  name: step.name,
                  instructions: step.instructions,
                  duration: step.duration,
                  component_to_render: step.component_to_render,
                  check_in_template_id: @check_in_template.id,
                })
          end
          
          start_time = Time.now
          schedule = IceCube::Schedule.new(start_time)
          schedule.add_recurrence_rule(IceCube::Rule.weekly.day(day).hour_of_day(hour).minute_of_hour(minute))

          company_users.each do |user_id|
            check_in_artifact = CheckInArtifact.find_or_initialize_by(check_in_template_id: @check_in_template.id, owned_by_id: user_id)
            next_start = Time.new(schedule.first.year, schedule.first.month, schedule.first.day, schedule.first.hour)
            check_in_artifact.update!(start_time: next_start )
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
      end
      Notification.where(notification_type: 5).each do |notification|
        notification.destroy
      end
    end
  end
end