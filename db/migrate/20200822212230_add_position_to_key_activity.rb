class AddPositionToKeyActivity < ActiveRecord::Migration[6.0]
  def change
    add_column :key_activities, :position, :integer
  end

  def data
    User.all.each do |user|
      user.key_activities.sort_by_priority.sort_by_created_date.each.with_index(1) do |key_activity, index|
        key_activity.update_column :position, index
      end
    end
  end
end
