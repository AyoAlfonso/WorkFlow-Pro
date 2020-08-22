class AddTodaysPriorityToKeyActivities < ActiveRecord::Migration[6.0]
  def change
    add_column :key_activities, :todays_priority, :boolean
  end
end
