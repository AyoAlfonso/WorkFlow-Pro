FactoryBot.define do
  factory :issue do
    user
    description { "Test description lalala"}
    company
  end
end
