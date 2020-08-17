json.extract! notification, :id, :method
json.rule IceCube::Schedule.from_hash(notification.rule).to_s
json.notification_type notification.notification_type.humanize.gsub(/\S+/, &:capitalize)
