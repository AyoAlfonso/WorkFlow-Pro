class AddMonthlyPlanningBooleanToDailyLog < ActiveRecord::Migration[6.0]
  def change
    add_column :daily_logs, :monthly_reflection, :boolean, default: false
  end
end
