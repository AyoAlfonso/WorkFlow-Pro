# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


c1 = Company.where(name: "Latero Labs").first_or_create(name: 'Latero Labs', address: '601-510 W Hastings St, Vancouver, BC V6B 1L8', contact_email: 'inquiries@laterolabs.com', phone_number: '604-933-5091', rallying_cry: 'Some rallying cry!')
CoreFour.where(company: c1).first_or_create(core_1: 'The First Core', core_2: 'The Second Core', core_3: 'The Third Core', core_4: 'The Fourth Core', company: c1)

# c2 = Company.where(name: "Lynchpyn").first_or_create(name: 'Lynchpyn', address: 'Toronto', contact_email: 'parham@lynchpyn.com', phone_number: '647-631-1996', rallying_cry: 'Some rallying cry!')
# CoreFour.where(company: c1).first_or_create(core_1: 'The First Core', core_2: 'The Second Core', core_3: 'The Third Core', core_4: 'The Fourth Core', company_id: c2.id)
# User.create!(first_name: 'Parham', last_name: 'Chinikar', email: 'parham@lynchpyn.com', phone_number: '647-631-1996', password: 'password', password_confirmation: 'password', company_id: c2.id)

if Rails.env.development?
  AdminUser.where(email: "admin@example.com").first_or_create(email: 'admin@example.com', password: 'password', password_confirmation: 'password')
  User.where(email: "sunny@laterolabs.com").first_or_create(first_name: 'Sunny', last_name: 'To', email: 'sunny@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id)
  User.where(email: "christopher@laterolabs.com").first_or_create(first_name: 'Christopher', last_name: 'Pang', email: 'christopher@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id)
  User.where(email: "kyle@laterolabs.com").first_or_create(first_name: 'Kyle', last_name: 'So', email: 'kyle@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id)
  User.where(email: "derek@laterolabs.com").first_or_create(first_name: 'Derek', last_name: 'Yau', email: 'derek@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id)
  User.where(email: "laurel@laterolabs.com").first_or_create(first_name: 'Laurel', last_name: 'Olsen', email: 'laurel@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id)
  User.where(email: "jeremy@laterolabs.com").first_or_create(first_name: 'Jeremy', last_name: 'Paterson', email: 'jeremy@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id)
  User.where(email: "allen@laterolabs.com").first_or_create(first_name: 'Allen', last_name: 'Greer', email: 'allen@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id)
  User.where(email: "shaun@laterolabs.com").first_or_create(first_name: 'Shaun', last_name: 'Schwartz', email: 'shaun@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id)
end

