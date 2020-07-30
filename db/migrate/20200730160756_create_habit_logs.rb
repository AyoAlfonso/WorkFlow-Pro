class CreateHabitLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :habit_logs do |t|
      t.date :log_date
      t.references :habit, null: false, foreign_key: true

      t.timestamps
    end
  end
end
