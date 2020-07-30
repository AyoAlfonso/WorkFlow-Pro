class Date
  # Returns the date of previous Sunday of today's week
  def self.current_week_start
    Date.today.days_ago(Date.today.wday)
  end
  # Returns the date of previous Sunday of a date instance
  def week_start
    self.days_ago(self.wday)
  end
  # Returns the date of next Saturday of today's week
  def self.current_week_end
    current_week_start.next_day(6)
  end
  # Returns the date of the next Saturday of a date instance
  def week_end
    week_start.next_day(6)
  end
end