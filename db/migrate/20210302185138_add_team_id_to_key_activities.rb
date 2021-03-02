class AddTeamIdToKeyActivities < ActiveRecord::Migration[6.0]
  def change
    add_reference :key_activities, :team, null: true
  end
end
