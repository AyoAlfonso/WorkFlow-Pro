class AddMeetingReferenceToKeyActivities < ActiveRecord::Migration[6.0]
  def change
    add_reference :key_activities, :meeting, index: true, foreign_key: true
  end
end
