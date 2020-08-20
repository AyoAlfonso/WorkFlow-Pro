module NotificationsHelper
  def human_type(notification_type)
    notification_type.humanize.gsub(/\S+/, &:capitalize)
  end
end
