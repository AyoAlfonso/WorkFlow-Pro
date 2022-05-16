class AddItemToUserActivityLogs < ActiveRecord::Migration[6.1]
  def change
    add_column :user_activity_logs, :item, :string
  end
end
