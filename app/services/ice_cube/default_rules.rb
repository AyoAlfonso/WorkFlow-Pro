class IceCube::DefaultRules
  def self.default_daily_personal_planning_rule
    schedule = IceCube::Schedule.new
    schedule.add_recurrence_rule(IceCube::Rule.daily.hour_of_day(12).minute_of_hour(0))
    schedule.to_h
  end

  def self.default_weekly_personal_planning_rule
    schedule = IceCube::Schedule.new
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:monday).hour_of_day(10).minute_of_hour(0))
    schedule.to_h
  end

  def self.default_end_of_week_stats_rule
    schedule = IceCube::Schedule.new
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:friday).hour_of_day(17).minute_of_hour(0))
    schedule.to_h
  end

  def self.default_sync_meeting_rule
    schedule = IceCube::Schedule.new
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:monday).hour_of_day(10).minute_of_hour(0))
    schedule.to_h
  end
end
