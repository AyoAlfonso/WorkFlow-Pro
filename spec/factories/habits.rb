FactoryBot.define do
  factory :habit do
    user
    frequency { 1 }
    name { "MyString" }

  end
end
