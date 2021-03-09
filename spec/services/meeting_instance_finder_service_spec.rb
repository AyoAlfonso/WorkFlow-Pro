require 'rails_helper'

RSpec.describe MeetingInstanceFinderService do

  describe "call" do
    let!(:current_user) {create(:user)}
    let(:team_weekly_t) {create(:meeting_template, meeting_type: 0)}
    let!(:personal_weekly_t) {create(:meeting_template, meeting_type: 1)}
    let!(:personal_daily_t) {create(:meeting_template, meeting_type: 10)}
    let!(:personal_monthly_t) {create(:meeting_template, meeting_type: 3)}
    let!(:meeting_pd) {create(:meeting, meeting_template: personal_daily_t, team: nil, hosted_by: current_user, start_time: DateTime.new(2021,3,9,12))}
    let!(:meeting_pw) {create(:meeting, meeting_template: personal_weekly_t, team: nil, hosted_by: current_user, start_time: DateTime.new(2021,3,9,12))}

    context "existing meetings" do
      before :each do
        Timecop.freeze('2021-03-09 17:00:00 -0700')
      end
      after :each do
        Timecop.return
      end

      it "fetches a personal daily scope" do
        expect(MeetingInstanceFinderService.call(Meeting.team_meetings(nil).hosted_by_user(current_user), personal_daily_t.id, Time.now)).to include(meeting_pd)
      end
  
      it "fetches a personal weekly scope as long as an instance existse between the week" do
        expect(MeetingInstanceFinderService.call(Meeting.team_meetings(nil).hosted_by_user(current_user), personal_weekly_t.id, Time.now)).to include(meeting_pw)
      end
    end

    context "on another day of the week" do
      before :each do
        Timecop.freeze('2021-03-12 17:00:00 -0700')
      end
      after :each do
        Timecop.return
      end

      it "returns an empty scope if no existng daily meeting exists" do
        expect(MeetingInstanceFinderService.call(Meeting.team_meetings(nil).hosted_by_user(current_user), personal_daily_t.id, Time.now)).to_not include(meeting_pd)
      end
  
      it "fetches a personal weekly scope as long as an instance existse between the week" do
        expect(MeetingInstanceFinderService.call(Meeting.team_meetings(nil).hosted_by_user(current_user), personal_weekly_t.id, Time.now)).to include(meeting_pw)
      end
    end

    

    context "no existing meetings" do
        before :each do
          Timecop.freeze('2021-03-19 17:00:00 -0700')
        end
        after :each do
          Timecop.return
        end
      it "returns an empty scope if the scope is empty" do
        expect(MeetingInstanceFinderService.call(Meeting.team_meetings(nil).hosted_by_user(current_user), personal_monthly_t.id, Time.now).empty?).to be true
      end

      it "returns an empty scope if no existng daily meeting exists" do
        expect(MeetingInstanceFinderService.call(Meeting.team_meetings(nil).hosted_by_user(current_user), personal_daily_t.id, Time.now)).to_not include(meeting_pd)
      end

      it "returns an empty scope if no existing weekly meeting exists" do
        expect(MeetingInstanceFinderService.call(Meeting.team_meetings(nil).hosted_by_user(current_user), personal_daily_t.id, Time.now)).to_not include(meeting_pd)
      end


      it "returns an error if there is no scope provided" do
        expect{MeetingInstanceFinderService.call(Meeting.team_meetings(nil).hosted_by_user(create(:user)), personal_monthly_t.id, Time.now)}.to_not raise_error
      end

      it "returns an error if no date for finding the instance is provided" do
        expect{MeetingInstanceFinderService.call(Meeting.team_meetings(nil).hosted_by_user(current_user), nil, Time.now)}.to raise_error
      end
    end

  end

end