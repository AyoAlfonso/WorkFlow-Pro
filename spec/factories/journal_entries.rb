FactoryBot.define do
  factory :journal_entry do
    text { "MyString" }
    generated_from { nil }
    user
  end
end
