class AddPersonalFlagToIssuesAndKeyActivities < ActiveRecord::Migration[6.0]
  def change
    add_column :issues, :personal, :boolean, default: false
    add_column :key_activities, :personal, :boolean, default: false
  end
end
