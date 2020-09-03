class Notification < ApplicationRecord
  belongs_to :user
  enum notification_type: {
    create_my_day: 0,
    weekly_planning: 1,
    weekly_report: 2,
    weekly_alignment_meeting: 3
  }
  enum method: { disabled: 0, email: 1 }

  scope :owned_by_user, -> (user) { where(user: user) }
  scope :enabled, -> { where.not(method: "disabled") }

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
end
