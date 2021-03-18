module HasKeyActivityHelpers
  extend ActiveSupport::Concern
  
  #TODO ADD SCOPE FOR CURRENT_COMPANIES .user_current_company(current_company.id)
  def todays_priorities(current_company)
    self.key_activities.user_current_company(current_company.id).where(scheduled_group: ScheduledGroup.find_by_name("Today")).incomplete.sort_by_priority_and_created_at
  end

  def todays_completed_activities(current_company)
    self.key_activities.user_current_company(current_company.id).completed_today_for_user(self)
  end

  def yesterdays_completed_activities(current_company)
    self.key_activities.user_current_company(current_company.id).completed_yesterday_for_user(self)
  end

end