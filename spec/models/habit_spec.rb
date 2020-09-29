require 'rails_helper'

RSpec.describe Habit, type: :model do

    
  before :each do
    Timecop.freeze(2020, 8, 7) #Friday, the fifth day
  end

  context "fixing a Friday to compare" do
    let(:week_start) { Date.current_week_start }
    let(:user) {create(:user)}
    let!(:habit_w_logs) { create(
      :habit,
      user: user,
      habit_logs: [
        build(:habit_log, log_date: week_start.prev_day(3)),
        build(:habit_log, log_date: week_start.next_day(1)),
        build(:habit_log, log_date: week_start.next_day(3)),
        build(:habit_log, log_date: week_start.next_day(5)),
      ]
    )}
    let!(:habit_no_logs) { create(:habit, user: user) }

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
      it "should expect there to be a 200% decrease on the weekly log differences" do
        expect(habit_w_logs.weekly_logs_completion_difference).to eq(200.0)
      end
      
      it "should expect there to be a 40% decrease on the weekly log differences" do
        #5 => 3, (3-5)/5 should be a 40% decrease
        habit_w_logs.habit_logs.create(log_date: week_start.prev_day(5))
        habit_w_logs.habit_logs.create(log_date: week_start.prev_day(4))
        habit_w_logs.habit_logs.create(log_date: week_start.prev_day(2))
        habit_w_logs.habit_logs.create(log_date: week_start.prev_day(1))
        expect(habit_w_logs.weekly_logs_completion_difference).to eq(-40.0)
      end

      it "should expect there to be a 33.3% decrease on the weekly log differences" do
        habit_w_logs.habit_logs.create(log_date: week_start.prev_day(4))
        habit_w_logs.habit_logs.create(log_date: week_start.prev_day(2))
        habit_w_logs.habit_logs.create(log_date: week_start.prev_day(1))
        habit_w_logs.habit_logs.create(log_date: week_start.next_day(4))
        expect(habit_w_logs.weekly_logs_completion_difference).to eq(4/3-1)
      end
    end
  
  end
  after :each do
    Timecop.return
  end

  
end
