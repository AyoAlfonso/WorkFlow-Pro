module NotificationsSpecHelper
  # The IceCube rule start_time needs to be in the past when the job runs
  # The start_time is set in the gem itself so Timecop.freeze doesn't seem to do anything
  def update_start_time_to_be_in_past(notification)
    current_rule = notification.rule
    current_rule['start_time'] = (Time.current - 7.days).to_s
    notification.update(rule: current_rule)
  end
end
