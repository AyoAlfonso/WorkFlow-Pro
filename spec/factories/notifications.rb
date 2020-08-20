FactoryBot.define do
  factory :notification do
    user
    notification_type {}
    rule {}
  end
end
