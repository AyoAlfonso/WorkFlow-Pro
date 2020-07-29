class CreateHabits < ActiveRecord::Migration[6.0]
  def change
    create_table :habits do |t|
      t.integer :frequency
      t.string :name
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
