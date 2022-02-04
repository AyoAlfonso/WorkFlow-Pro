class AddOrgForumDataToMeetingTemplates < ActiveRecord::Migration[6.1]
  def data
    MeetingTemplate.create(meeting_type: :organisation_forum_monthly, name: "Organisation Forum Monthly")
  end
end
