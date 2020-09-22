class AddWeeklyPlanningBooleanToDailyLog < ActiveRecord::Migration[6.0]
  def change
    add_column :daily_logs, :weekly_reflection, :boolean, default: false
  end
end
