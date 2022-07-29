class IceCube::RuleHelper
  def self.get_day_of_week(rule)
    return I18n.t "notification_rules.every" if rule["rule_type"] == "IceCube::DailyRule"

    # All validation values are stored as an array
    day = rule["validations"]["day"].first
    case day
    when 0
      I18n.t "notification_rules.sunday"
    when 1
      I18n.t "notification_rules.monday"
    when 2
      I18n.t "notification_rules.tuesday"
    when 3
      I18n.t "notification_rules.wednesday"
    when 4
      I18n.t "notification_rules.thursday"
    when 5
      I18n.t "notification_rules.friday"
    when 6
      I18n.t "notification_rules.saturday"
    end
  end

  def self.day_of_week_as_int(params)
    if params["day"].present? 
      day = params["day"]
    end

    if params[:day_of_week].present? 
      day = params[:day_of_week]
    end
  
    return if day == I18n.t("notification_rules.every")

    # All validation values are stored as an array
    case day
    when I18n.t("notification_rules.sunday")
      0
    when I18n.t("notification_rules.monday")
      1
    when I18n.t("notification_rules.tuesday")
      2
    when I18n.t("notification_rules.wednesday")
      3
    when I18n.t("notification_rules.thursday")
      4
    when I18n.t("notification_rules.friday")
      5
    when I18n.t("notification_rules.saturday")
      6
    end
  end

  def self.get_time_of_day(rule)
    hour = rule["validations"]["hour_of_day"].first
    minutes = rule["validations"]["minute_of_hour"]&.first || 0
    Tod::TimeOfDay.new(hour, minutes).strftime("%l:%M %p").strip
  end

  def self.hour_of_day_as_int(params)
    if params["time"].present? 
      time = params["time"]
    end

    if params[:time_of_day].present? 
      time = params[:time_of_day]
    end
    Tod::TimeOfDay.parse(time).hour
  end

  def self.minute_of_hour_as_int(params)
    if params["time"].present? 
      time = params["time"]
    end

    if params[:time_of_day].present? 
      time = params[:time_of_day]
    end
    Tod::TimeOfDay.parse(time).minute
  end

  def self.construct_daily_rule(hour, minute)
    schedule = IceCube::Schedule.new(Time.current - 7.days)
    schedule.add_recurrence_rule(IceCube::Rule.daily.hour_of_day(hour).minute_of_hour(minute))
    schedule.to_h
  end

  def self.construct_weekly_rule(day, hour, minute)
    schedule = IceCube::Schedule.new(Time.current - 7.days)
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(day).hour_of_day(hour).minute_of_hour(minute))
    schedule.to_h
  end

  def self.construct_monthly_rule(date_time_config)
    schedule = IceCube::Schedule.new(Time.current - 7.days)
    day_as_int = IceCube::RuleHelper.day_of_week_as_int(date_time_config["day"])
    hour_as_int = IceCube::RuleHelper.hour_of_day_as_int(date_time_config["time"])
    minute_as_int = IceCube::RuleHelper.minute_of_hour_as_int(date_time_config["time"])

    schedule.add_recurrence_rule(IceCube::Rule.monthly.day(day_as_int).hour_of_day(hour_as_int).minute_of_hour(minute_as_int))
    # schedule.add_recurrence_rule(IceCube::Rule.weekly.day(day).hour_of_day(hour).minute_of_hour(minute))
    # IceCube::Rule.monthly.day(date_time_config["day"]).hour_of_day(10).minute_of_hour(0)
    schedule.to_h
  end

  def self.construct_bi_weekly_rule(day, hour, minute)
    schedule = IceCube::Schedule.new(Time.current - 7.days)
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(day).hour_of_day(hour).minute_of_hour(minute))
    schedule.to_h
  end

  
  def self.construct_yearly_rule(day, hour, minute)
    schedule = IceCube::Schedule.new(Time.current - 7.days)
    schedule.add_recurrence_rule(IceCube::Rule.weekly.day(day).hour_of_day(hour).minute_of_hour(minute))
    schedule.to_h
  end

  # def self.construct_rule(day, hour, minute, date_time_config)
  #   if day
  #     construct_weekly_rule(day, hour, minute)
  #   elsif(date_time_config["cadence"])
  #    return case date_time_config["cadence"] 
  #       when construct_monthly_rule(date_time_config)
  #     end
  #   else
  #     construct_daily_rule(hour, minute)
  #   end
  # end

  def self.construct_rule(day, hour, minute)
    if day
      construct_weekly_rule(day, hour, minute)
    else
      construct_daily_rule(hour, minute)
    end
  end
end
