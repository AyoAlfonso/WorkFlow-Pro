FactoryBot.define do
  factory :custom_setting do
    customizable { nil }
    setting_key { "MyString" }
    setting_value { "MyString" }
  end
end
