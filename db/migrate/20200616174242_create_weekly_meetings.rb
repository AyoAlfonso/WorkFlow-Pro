class CreateWeeklyMeetings < ActiveRecord::Migration[6.0]
  def change
    create_table :weekly_meetings do |t|
      t.references :created_by, references: :user
      t.string :emotions_img
      t.integer :conversation_starter_id
      t.float :average_rating

      t.timestamps
    end
  end
end
