# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password') if Rails.env.development?

Company.create!(name: 'First Test Company', address: '1234 Some Street, Vancouver, V6C 3T3', contact_email: 'some.company.email@gmail.com', phone_number: '604-933-5091', rallying_cry: 'Some rallying cry!')

User.create!(first_name: 'Example', last_name: 'User', email: 'user@example.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: Company.first.id) if Rails.env.development?

