class CreateMeetingRatings < ActiveRecord::Migration[6.0]
  def change
    create_table :meeting_ratings do |t|
      t.float :score
      t.references :user, null: false, foreign_key: true
      t.references :weekly_meeting, null: false, foreign_key: true

      t.timestamps
    end
  end
end
