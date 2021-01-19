class AddMeetingConfigurationAndCleanup < ActiveRecord::Migration[6.0]
  def up
    drop_table(:meeting_ratings, if_exists: true)
    drop_table(:weekly_meetings, if_exists: true)
  end

  def down
  end
end
