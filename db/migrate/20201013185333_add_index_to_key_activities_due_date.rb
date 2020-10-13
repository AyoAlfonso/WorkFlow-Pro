class AddIndexToKeyActivitiesDueDate < ActiveRecord::Migration[6.0]
  def change
    add_index :key_activities, [:due_date]
  end
end
