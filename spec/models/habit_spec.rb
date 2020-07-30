require 'rails_helper'

RSpec.describe Habit, type: :model do
  let(:week_start) { Date.current_week_start }
  let!(:habit) { create(
    :habit,
    habit_logs: [
      build(:habit_log, log_date: week_start.next_day(1)),
      build(:habit_log, log_date: week_start.next_day(3)),
      build(:habit_log, log_date: week_start.next_day(5)),
    ]
  )}
  describe "getting weekly logs" do
    it "should get only completed logs for current week" do
      expect(habit.complete_weekly_logs.count).to eq(3)
    end
    it "should build logs for days that aren't complete for current week" do
      expect(habit.weekly_logs.count).to eq(7)
    end
  end
end
