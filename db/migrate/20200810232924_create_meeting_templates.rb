class CreateMeetingTemplates < ActiveRecord::Migration[6.0]
  def change
    create_table :meeting_templates do |t|
      t.string :name
      t.integer :meeting_type
      t.float :duration
      t.references :team, null: false, foreign_key: true

      t.timestamps
    end
  end
end
