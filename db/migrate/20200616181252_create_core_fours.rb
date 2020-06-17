class CreateCoreFours < ActiveRecord::Migration[6.0]
  def change
    create_table :core_fours do |t|
      t.text :core_1
      t.text :core_2
      t.text :core_3
      t.text :core_4
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end
  end
end
