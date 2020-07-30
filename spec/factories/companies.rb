FactoryBot.define do
  factory :company do
    name { "Test Company Name"}
    fiscal_year_start { Date.new(2020, 01, 01) }
    timezone { "Canada/Pacific" }
  end
end
