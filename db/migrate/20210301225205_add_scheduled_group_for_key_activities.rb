class AddScheduledGroupForKeyActivities < ActiveRecord::Migration[6.0]
  def change
    add_reference :key_activities, :scheduled_group, null: true
  end
end
