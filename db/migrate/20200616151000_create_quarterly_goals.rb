class CreateQuarterlyGoals < ActiveRecord::Migration[6.0]
  def change
    create_table :quarterly_goals do |t|
      t.references :created_by_id, references: :user
      t.references :owned_by_id, references: :user
      t.string :importance
      t.text :description
      t.string :key_elements, array: true, default: []

      t.timestamps
    end
  end
end
