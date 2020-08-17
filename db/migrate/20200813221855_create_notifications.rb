class CreateNotifications < ActiveRecord::Migration[6.0]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :notification_type
      t.jsonb :rule
      t.integer :method
      t.timestamps
      t.index [:user_id, :notification_type], unique: true
    end
  end

  def data
    User.find_each do |user|
      user.create_default_notifications
    end
  end
end
