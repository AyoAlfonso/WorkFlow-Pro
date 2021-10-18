module HasTimezone
  extend ActiveSupport::Concern

  def convert_to_their_timezone(time = nil)
    if time.present? && time.respond_to?(:strftime)
      return time.in_time_zone(timezone_name)
    elsif time.blank?
      return Time.current.in_time_zone(timezone_name)
    end
    raise "Has no timezone error for conversion"
  end

  def timezone_name
    # user.timezone looks like "(GMT-08:00) Pacific Time (US & Canada)"
    # we need everything after "(GMT-08:00) "
    self.timezone[/(?<=\(GMT.\d{2}:\d{2}\)\s).*$/]
  end
end
