class CreateDailyLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :daily_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.date :log_date
      t.integer :work_status, default: 0

      t.timestamps
    end
  end
end
