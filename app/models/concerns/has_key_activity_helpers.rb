module HasKeyActivityHelpers
  extend ActiveSupport::Concern
  
  def todays_priorities
    self.key_activities.where(scheduled_group: ScheduledGroup.find_by_name("Today")).incomplete.sort_by_priority_and_created_at
  end

  def todays_completed_activities
    self.key_activities.completed_today_for_user(self)
  end

  def yesterdays_completed_activities
    self.key_activities.completed_yesterday_for_user(self)
  end

end