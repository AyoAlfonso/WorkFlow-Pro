FactoryBot.define do
  factory :daily_log do
    user
    log_date { "2020-07-27" }
    work_status { 1 }
  end
end
