class CreateMeetings < ActiveRecord::Migration[6.0]
  def change
    create_table :meetings do |t|
      t.float :average_rating
      t.integer :issues_done
      t.integer :key_activities_done
      t.float :average_team_mood
      t.float :goal_progress
      t.references :meeting, null: false, foreign_key: true

      t.timestamps
    end
  end
end
