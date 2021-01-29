FactoryBot.define do
  factory :user do
    user_role
    company
    first_name { 'FirstName' }
    last_name { 'LastName' }
    password { 'password' }
    timezone {"(GMT-08:00) Pacific Time (US & Canada)"}
    phone_number { '123-456-7890'}
    sequence(:email) {|n| "user#{n}@example.com" }
    default_selected_company factory: :company
  end
end
