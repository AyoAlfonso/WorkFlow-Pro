class CreateCheckInTemplate < ActiveRecord::Migration[6.0]
  def change
    create_table :check_in_templates do |t|
      t.string :name
      t.integer :check_in_type
      t.text :description
      t.timestamps
    end
  end
end
