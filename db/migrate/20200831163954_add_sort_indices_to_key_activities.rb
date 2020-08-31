class AddSortIndicesToKeyActivities < ActiveRecord::Migration[6.0]
  def change
    add_index :key_activities, :completed_at
    add_index :key_activities, :created_at
    remove_column :key_activities, :complete, :boolean
    add_index :key_activities, [:created_at, :position, :priority]
    add_index :key_activities, [:completed_at, :position, :priority]
    add_index :key_activities, [:user_id, :completed_at]
    add_index :key_activities, [:user_id, :created_at]
  end
end
