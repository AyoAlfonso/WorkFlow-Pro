class IceCube::DefaultRules
  def self.default_create_my_day_rule
    schedule = IceCube::Schedule.new
    schedule.add_recurrence_rule(IceCube::Rule.daily.hour_of_day(12).minute_of_hour(0))
    schedule.to_h
  end

  def self.default_weekly_planning_rule
    schedule = IceCube::Schedule.new
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:monday).hour_of_day(10).minute_of_hour(0))
    schedule.to_h
  end

  def self.default_weekly_report_rule
    schedule = IceCube::Schedule.new
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:friday).hour_of_day(17).minute_of_hour(0))
    schedule.to_h
  end

  def self.default_weekly_alignment_meeting_rule
    schedule = IceCube::Schedule.new
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(:monday).hour_of_day(10).minute_of_hour(0))
    schedule.to_h
  end
end
