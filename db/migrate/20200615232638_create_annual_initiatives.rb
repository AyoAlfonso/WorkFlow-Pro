class CreateAnnualInitiatives < ActiveRecord::Migration[6.0]
  def change
    create_table :annual_initiatives do |t|
      t.references :created_by, references: :user
      t.references :owned_by, references: :user
      t.string :importance, array: true, default: []
      t.text :description
      t.string :key_elements, array: true, default: []

      t.timestamps
    end
  end
end
