class IceCube::DefaultRules
  def self.default_daily_planning_rule
    schedule = IceCube::Schedule.new(Time.current - 7.days)
    schedule.add_recurrence_rule(IceCube::Rule.daily.hour_of_day(12).minute_of_hour(0))
    schedule.to_h
  end

  def self.default_weekly_planning_old_rule
    schedule = IceCube::Schedule.new(Time.current - 7.days)
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:monday).hour_of_day(10).minute_of_hour(0))
    schedule.to_h
  end

  def self.default_weekly_planning_rule
    schedule = IceCube::Schedule.new(Time.current - 7.days)
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:monday).hour_of_day(10).minute_of_hour(0))
    schedule.to_h
  end

  def self.default_weekly_report_rule
    schedule = IceCube::Schedule.new(Time.current - 7.days)
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:friday).hour_of_day(17).minute_of_hour(0))
    schedule.to_h
  end

  def self.default_weekly_alignment_meeting_rule
    schedule = IceCube::Schedule.new(Time.current - 7.days)
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:monday).hour_of_day(10).minute_of_hour(0))
    schedule.to_h
  end

  def self.default_evening_reflection_rule
    schedule = IceCube::Schedule.new(Time.current - 7.days)
    schedule.add_recurrence_rule(IceCube::Rule.daily.hour_of_day(16).minute_of_hour(0))
    schedule.to_h
  end
end
