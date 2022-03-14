class AddDescriptionToKeyActivities < ActiveRecord::Migration[6.1]
  def change
    add_column :key_activities, :body, :string
  end
end
