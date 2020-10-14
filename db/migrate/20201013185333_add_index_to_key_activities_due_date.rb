class AddIndexToKeyActivitiesDueDate < ActiveRecord::Migration[6.0]
  def change
    add_index :key_activities, [:due_date]
    add_index :key_activities, [:user_id, :weekly_list, :todays_priority, :completed_at, :due_date, :created_at], name: "index_key_activities_scoped_created_at_due_date"
    add_index :key_activities, [:user_id, :weekly_list, :todays_priority, :completed_at, :due_date, :priority], name: "index_key_activities_scoped_priority_due_date"
  end
end
