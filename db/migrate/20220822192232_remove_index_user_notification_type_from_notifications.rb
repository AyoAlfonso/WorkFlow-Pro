class RemoveIndexUserNotificationTypeFromNotifications < ActiveRecord::Migration[6.1]
  def change
    remove_index :notifications, column: [:user_id, :notification_type]
  end
end
