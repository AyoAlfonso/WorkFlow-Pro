class CreateStaticData < ActiveRecord::Migration[6.0]
  def change
    create_table :static_data do |t|
      t.string :field
      t.text :value
      t.timestamps
    end
  end
end
