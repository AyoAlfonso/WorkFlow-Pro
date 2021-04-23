class CreateSubInitiatives < ActiveRecord::Migration[6.0]
  def change
    create_table :sub_initiatives do |t|
      t.references :quarterly_goal, null: false, foreign_key: true
      t.references :created_by, references: :user
      t.references :owned_by, references: :user
      t.string :importance, array: true, default: []
      t.text :description
      t.string :key_elements, array: true, default: []
      t.string :context_description
      t.date :closed_at
      t.timestamps
    end
  end
end
