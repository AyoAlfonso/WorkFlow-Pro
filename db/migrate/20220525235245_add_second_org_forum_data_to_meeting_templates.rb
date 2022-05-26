class AddSecondOrgForumDataToMeetingTemplates < ActiveRecord::Migration[6.1]
  def change
    MeetingTemplate.create(meeting_type: :organisation_forum_monthly, name: "Organisation Forum Monthly 3-hour")
  end
end
