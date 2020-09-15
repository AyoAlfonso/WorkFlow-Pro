class ChangeDefaultWorkStatusForDailyLog < ActiveRecord::Migration[6.0]
  def change
    change_column_default :daily_logs, :work_status, from: 0, to: 4
  end
end
