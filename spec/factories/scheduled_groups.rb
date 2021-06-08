FactoryBot.define do
  factory :scheduled_group do
    sequence(:name) {|n| "name#{n}" }

    factory :today_scheduled_group do
      name {"Today"}
    end
  end
end
