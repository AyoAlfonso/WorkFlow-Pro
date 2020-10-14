class AddDueDateToKeyActivities < ActiveRecord::Migration[6.0]
  def change
    add_column :key_activities, :due_date, :date
  end
end
