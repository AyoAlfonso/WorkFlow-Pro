class DropOldSurveyTables < ActiveRecord::Migration[6.0]
  def change
    drop_table :create_my_days
    drop_table :thought_challenges
    drop_table :personal_reflections
  end
end
