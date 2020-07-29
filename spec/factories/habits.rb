FactoryBot.define do
  factory :habit do
    frequency { 1 }
    name { "MyString" }
    user { nil }
  end
end
