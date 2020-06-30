class ChangeKeyActivitiesPriorityToEnum < ActiveRecord::Migration[6.0]
  def change
    remove_column :key_activities, :priority
    add_column :key_activities, :priority, :integer, default: 0
  end
end
