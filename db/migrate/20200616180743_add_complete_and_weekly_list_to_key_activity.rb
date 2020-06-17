class AddCompleteAndWeeklyListToKeyActivity < ActiveRecord::Migration[6.0]
  def change
    add_column :key_activities, :complete, :boolean
    add_column :key_activities, :weekly_list, :boolean
  end
end
