class CreateComments < ActiveRecord::Migration[6.0]
  def change
    create_table :comments do |t|
      t.references :annual_initiative, null: false, foreign_key: true
      t.references :created_by_id, references: :user
      t.text :body

      t.timestamps
    end
  end
end
