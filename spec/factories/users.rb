FactoryBot.define do
  factory :user do
    user_role
    company
    first_name { 'FirstName' }
    last_name { 'LastName' }
    password { 'password' }
    phone_number { '123-456-7890'}
    email { 'user@example.com' }

  end
end
