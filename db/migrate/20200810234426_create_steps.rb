class CreateSteps < ActiveRecord::Migration[6.0]
  def change
    create_table :steps do |t|
      t.integer :step_type
      t.integer :order_index
      t.string :name
      t.text :instructions
      t.float :duration
      t.string :component_to_render
      t.references :meeting_template, null: false, foreign_key: true

      t.timestamps
    end
  end
end
