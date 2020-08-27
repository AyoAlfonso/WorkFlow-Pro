module ApplicationHelper
  def timezones
    ActiveSupport::TimeZone.all.map &:to_s
  end

  def static_data #MAY WANT TO REFACTOR THIS AWAY AS A SEPARATE SERVICE SOMETIME
    {
      timezones: timezones,
      user_roles: UserRole.all,
      conversation_starters: ConversationStarter.all
    }
  end
end
