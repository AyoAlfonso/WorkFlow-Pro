require 'rails_helper'

RSpec.describe StatsHelper, type: :helper do
  

  describe "get_beginning_of_last_or_current_work_week_date" do

    context "Monday west coast, Tuesday east coast" do
      before :each do
        Timecop.freeze('2020-09-21 23:00:00 -0700')
      end

      it "should return last week for a Monday based on Timezone" do
        current_time = Time.current.in_time_zone("Pacific Time (US & Canada)")
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Pacific Time (US & Canada)"))).to eq "2020-09-14 0:00:00 -0700"
      end

      it "should return current week for a Tuesday based on Timezone" do
        expect(Time.current.in_time_zone("Eastern Time (US & Canada)")).to eq "2020-09-22 2:00:00 -0400"
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Eastern Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0400"
      end

      after :each do
        Timecop.return
      end
    end

    context "Tuesday west coast, Wednesday east coast" do
      before :each do
        Timecop.freeze('2020-09-22 23:00:00 -0700')
      end

      it "should return current week for a Tuesday based on Timezone" do
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Pacific Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0700"
      end

      it "should return current week for a Wednesday based on Timezone" do
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Eastern Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0400"
      end

      after :each do
        Timecop.return
      end
    end

    context "Wed west coast, Thurs east coast" do
      before :each do
        Timecop.freeze('2020-09-23 23:00:00 -0700')
      end

      it "should return current week for a Wednesday based on Timezone" do
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Pacific Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0700"
      end

      it "should return current week for a Thursday based on Timezone" do
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Eastern Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0400"
      end
      after :each do
        Timecop.return
      end
    end

    context "Thurs west coast, Fri east coast" do
      before :each do
        Timecop.freeze('2020-09-24 23:00:00 -0700')
      end

      it "should return current week for a Thursday based on Timezone" do
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Pacific Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0700"
      end

      it "should return current week for a Friday based on Timezone" do
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Eastern Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0400"
      end

      after :each do
        Timecop.return
      end
    end

    context "Fri west coast, Sat east coast" do
      before :each do
        Timecop.freeze('2020-09-25 23:00:00 -0700')
      end

      it "should return current week for a Friday based on Timezone" do
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Pacific Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0700"
      end

      it "should return current week for a Saturday based on Timezone" do
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Eastern Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0400"
      end

      after :each do
        Timecop.return
      end
    end

    context "Sat west coast, Sun east coast" do
      before :each do
        Timecop.freeze('2020-09-26 23:00:00 -0700')
      end

      it "should return current week for a Saturday based on Timezone" do
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Pacific Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0700"
      end

      it "should return current week for a Sunday based on Timezone" do
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Eastern Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0400"
      end

      after :each do
        Timecop.return
      end
    end

    context "Sun west coast, Mon east coast" do
      before :each do
        Timecop.freeze('2020-09-27 23:00:00 -0700')
      end

      it "should return current week for a Sunday based on Timezone" do
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Pacific Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0700"
      end

      it "should return current week for a Monday based on Timezone" do
        expect(Time.current.in_time_zone("Eastern Time (US & Canada)")).to eq "2020-09-28 2:00:00 -0400"
        expect(helper.get_beginning_of_last_or_current_work_week_date(Time.current.in_time_zone("Eastern Time (US & Canada)"))).to eq "2020-09-21 0:00:00 -0400"
      end

      after :each do
        Timecop.return
      end
    end

  end
end
