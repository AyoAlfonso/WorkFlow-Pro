json.extract! notification, :id, :method
json.notification_type notification.notification_type.humanize.gsub(/\S+/, &:capitalize)

json.rules do
  json.array! notification.rule['rrules'], partial: 'api/notifications/rule', as: :rule
end

json.validations do
  json.array! notification.rule['rrules'], partial: 'api/notifications/validation', as: :validation
end
