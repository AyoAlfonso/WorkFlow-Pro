class Notification < ApplicationRecord
  belongs_to :user
  enum notification_type: {
    daily_personal_planning: 0,
    weekly_personal_planning: 1,
    end_of_week_stats: 2,
    sync_meeting: 3
  }
  enum method: { disabled: 0, email: 1 }

  scope :owned_by_user, -> (user) { where(user: user) }

  def self.default_daily_personal_planning_rule
    schedule = IceCube::Schedule.new
    schedule.add_recurrence_rule(IceCube::Rule.daily.hour_of_day(7))
    schedule.to_h
  end

  def self.default_weekly_personal_planning_rule
    schedule = IceCube::Schedule.new
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:monday).hour_of_day(10))
    schedule.to_h
  end

  def self.default_end_of_week_stats_rule
    schedule = IceCube::Schedule.new
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:friday).hour_of_day(17))
    schedule.to_h
  end

  def self.default_sync_meeting_rule
    schedule = IceCube::Schedule.new
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:monday).hour_of_day(10))
    schedule.to_h
  end
end
