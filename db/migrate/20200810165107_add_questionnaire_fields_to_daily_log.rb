class AddQuestionnaireFieldsToDailyLog < ActiveRecord::Migration[6.0]
  def change
    add_column :daily_logs, :create_my_day, :boolean
    add_column :daily_logs, :evening_reflection, :boolean
  end
end
