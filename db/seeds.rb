# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password') if Rails.env.development?

Company.create!(name: 'Latero Labs', address: '601-510 W Hastings St, Vancouver, BC V6B 1L8', contact_email: 'inquiries@laterolabs.com', phone_number: '604-933-5091', rallying_cry: 'Some rallying cry!')

User.create!(first_name: 'Sunny', last_name: 'To', email: 'sunny@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: Company.first.id) if Rails.env.development?
User.create!(first_name: 'Derek', last_name: 'Yau', email: 'derek@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: Company.first.id) if Rails.env.development?
User.create!(first_name: 'Christopher', last_name: 'Pang', email: 'christopher@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: Company.first.id) if Rails.env.development?
User.create!(first_name: 'Laurel', last_name: 'Olsen', email: 'laurel@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: Company.first.id) if Rails.env.development?
User.create!(first_name: 'Jeremy', last_name: 'Paterson', email: 'jeremy@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: Company.first.id) if Rails.env.development?
User.create!(first_name: 'Allen', last_name: 'Greer', email: 'allen@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: Company.first.id) if Rails.env.development?
User.create!(first_name: 'Shaun', last_name: 'Schwartz', email: 'shaun@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: Company.first.id) if Rails.env.development?
User.create!(first_name: 'Kyle', last_name: 'So', email: 'kyle@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: Company.first.id) if Rails.env.development?

CoreFour.create!(core_1: 'The First Core', core_2: 'The Second Core', core_3: 'The Third Core', core_4: 'The Fourth Core', company_id: 1)