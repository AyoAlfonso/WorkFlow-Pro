require 'rails_helper'

RSpec.describe Meeting, type: :model do
  
  describe "title" do
    let(:meeting_template_personal_weekly) {create(:meeting_template, meeting_type: "personal_weekly")}
    let(:meeting_template_team_weekly) {create(:meeting_template, meeting_type: "team_weekly")}
    let(:team) {create(:team)}
    let(:user) {create(:user, timezone: "(GMT-08:00) Pacific Time (US & Canada)")}
    let(:usere) {create(:user, timezone: "(GMT-05:00) Eastern Time (US & Canada)")}
    
    context "Monday west coast, Tuesday east coast" do
      before :each do
        Timecop.freeze('2020-09-21 23:00:00 -0700')
      end

      it "returns previous week for west coast weekly planning" do
        meeting = create(:meeting, hosted_by: user, meeting_template: meeting_template_personal_weekly, start_time: user.time_in_user_timezone)
        expect(meeting.title).to eq("Planning for Week of September 21")
      end   

      it "returns this week for east coast weekly planning" do
        meeting = create(:meeting, hosted_by: usere, meeting_template: meeting_template_personal_weekly, start_time: user.time_in_user_timezone)
        expect(meeting.title).to eq("Planning for Week of September 28")
      end

      it "returns the current date for team weekly planning" do 
        meeting = create(:meeting, hosted_by: user, team: team, meeting_template: meeting_template_team_weekly, start_time: user.time_in_user_timezone)
        expect(meeting.title).to eq("Monday, September 21")
      end

      it "returns the current date for team weekl planning" do
        meeting = create(:meeting, hosted_by: usere, team: team, meeting_template: meeting_template_team_weekly, start_time: user.time_in_user_timezone)
        expect(meeting.title).to eq("Tuesday, September 22")
      end

      after :each do
        Timecop.return
      end
    end

    context "Thursday west coast, Friday east coast" do
      before :each do
        Timecop.freeze('2020-09-24 23:00:00 -0700')
      end

      it "returns previous week for west coast weekly planning" do
        meeting = create(:meeting, hosted_by: user, meeting_template: meeting_template_personal_weekly, start_time: user.time_in_user_timezone)
        expect(meeting.title).to eq("Planning for Week of September 28")
      end   

      it "returns this week for east coast weekly planning" do
        meeting = create(:meeting, hosted_by: usere, meeting_template: meeting_template_personal_weekly, start_time: user.time_in_user_timezone)
        expect(meeting.title).to eq("Planning for Week of September 28")
      end

      it "returns the current date for team weekly planning" do 
        meeting = create(:meeting, hosted_by: user, team: team, meeting_template: meeting_template_team_weekly, start_time: user.time_in_user_timezone)
        expect(meeting.title).to eq("Thursday, September 24")
      end

      it "returns the current date for team weekl planning" do
        meeting = create(:meeting, hosted_by: usere, team: team, meeting_template: meeting_template_team_weekly, start_time: user.time_in_user_timezone)
        expect(meeting.title).to eq("Friday, September 25")
      end

      after :each do
        Timecop.return
      end
    end

    context "Sunday west coast, Monday east coast" do
      before :each do
        Timecop.freeze('2020-09-27 23:00:00 -0700')
      end

      it "returns previous week for west coast weekly planning" do
        meeting = create(:meeting, hosted_by: user, meeting_template: meeting_template_personal_weekly, start_time: user.time_in_user_timezone)
        expect(meeting.title).to eq("Planning for Week of September 28")
      end   

      it "returns this week for east coast weekly planning" do
        meeting = create(:meeting, hosted_by: usere, meeting_template: meeting_template_personal_weekly, start_time: user.time_in_user_timezone)
        expect(meeting.title).to eq("Planning for Week of September 28")
      end

      it "returns the current date for team weekly planning" do 
        meeting = create(:meeting, hosted_by: user, team: team, meeting_template: meeting_template_team_weekly, start_time: user.time_in_user_timezone)
        expect(meeting.title).to eq("Sunday, September 27")
      end

      it "returns the current date for team weekl planning" do
        meeting = create(:meeting, hosted_by: usere, team: team, meeting_template: meeting_template_team_weekly, start_time: user.time_in_user_timezone)
        expect(meeting.title).to eq("Monday, September 28")
      end

      after :each do
        Timecop.return
      end
    end

  end
end
