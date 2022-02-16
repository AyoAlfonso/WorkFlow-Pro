class AddAdjustedDateToObjectiveLogs < ActiveRecord::Migration[6.1]
  def change
    add_column :objective_logs, :adjusted_date, :timestamp
  end
end
