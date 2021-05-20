class Notification < ApplicationRecord
  belongs_to :user
  enum notification_type: {
    daily_planning: 0,
    weekly_planning_old: 1, #removed, no longer used
    weekly_planning: 2,
    weekly_alignment_meeting: 3,
    evening_reflection: 4
  }
  enum method: { disabled: 0, email: 1 }

  scope :remove_deprecated, -> { where.not(notification_type: 1) }
  scope :owned_by_user, -> (user) { where(user: user) }
  scope :enabled, -> { where.not(method: "disabled") }

  before_update :set_start_time_to_be_in_past

  def update_notification(params)
    method = params[:method]
    validation_rule = params[:validations].first
    day_as_int = IceCube::RuleHelper.day_of_week_as_int(validation_rule)
    hour_as_int = IceCube::RuleHelper.hour_of_day_as_int(validation_rule)
    minute_as_int = IceCube::RuleHelper.minute_of_hour_as_int(validation_rule)
    self.update!(
      rule: IceCube::RuleHelper.construct_rule(day_as_int, hour_as_int, minute_as_int),
      method: method
    )
  end

  # When a rule notification is updated the IceCube rule's start_time is too.
  # If the day from the start_time is today any notifications that should run today, won't run
  # This is a known bug https://github.com/seejohnrun/ice_cube/issues/442
  # Setting the start_time like this this also helps assure the start_time is in UTC across all systems
  # The notification (aka occurrence) time timezone is based on the start_time's zone
  def set_start_time_to_be_in_past
    current_rule = self.rule
    current_rule['start_time'] = (Time.current - 7.days).to_s
  end
end
