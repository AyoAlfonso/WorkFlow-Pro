require 'rails_helper'

RSpec.describe DailyLog, type: :model do
  it { should belong_to(:user) }
  it { should define_enum_for(:work_status).with_values([:working, :work_from_home, :half_day, :day_off]) }
end
