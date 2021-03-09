FactoryBot.define do
  factory :scheduled_group do
    sequence(:name) {|n| "name#{n}" }
  end
end
