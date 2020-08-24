require 'rails_helper'

RSpec.describe Habit, type: :model do
  let(:week_start) { Date.current_week_start }
  let!(:habit_w_logs) { create(
    :habit,
    habit_logs: [
      build(:habit_log, log_date: week_start.prev_day(3)),
      build(:habit_log, log_date: week_start.next_day(1)),
      build(:habit_log, log_date: week_start.next_day(3)),
      build(:habit_log, log_date: week_start.next_day(5)),
    ]
  )}
  let!(:habit_no_logs) { create(:habit) }
  
  before :each do
    Timecop.freeze(2020, 8, 7) #Friday, the fifth day
  end

  after :each do
    Timecop.return
  end

  describe "weekly logs" do

    it "completed should get only completed logs for current week" do
      expect(habit_w_logs.complete_current_week_logs.count).to eq(3)
    end
    it "should get all logs for the current week" do
      expect(habit_w_logs.current_week_logs.count).to eq(5)
    end

  end

  describe "previous logs" do
    it "should have 7 entries for previous week logs" do
      expect(habit_no_logs.previous_week_logs.count).to eq(7)
    end
    it "completed should have entries based on previous logs" do
      expect(habit_no_logs.complete_previous_week_logs.count).to eq(0)
      expect(habit_w_logs.complete_previous_week_logs.count).to eq(1)
    end
  end

  describe "weekly logs completion difference" do
    it "should expect there to be a 40% decrease on the weekly log differences" do
      expect(habit_w_logs.weekly_logs_completion_difference).to eq("-40.0%")
    end
  end

end
