class CreateQuarterlyGoals < ActiveRecord::Migration[6.0]
  def change
    create_table :quarterly_goals do |t|
      t.references :created_by, references: :user
      t.references :owned_by, references: :user
      t.references :annual_initiative, null: false, foreign_key: true
      t.string :importance, array: true, default: []
      t.text :description
      t.string :key_elements, array: true, default: []

      t.timestamps
    end
  end
end
