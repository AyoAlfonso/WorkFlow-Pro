module ApplicationHelper
  def timezones
    ActiveSupport::TimeZone.all.map &:to_s
  end
end
