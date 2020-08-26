class AddDefaultBooleanValuesToKeyActivities < ActiveRecord::Migration[6.0]
  def up
    change_column :key_activities, :weekly_list, :boolean, default: false, nil: false
    change_column :key_activities, :todays_priority, :boolean, default: false, nil: false
  end
  def down
    change_column :key_activities, :weekly_list, :boolean
    change_column :key_activities, :todays_priority, :boolean
  end
end
