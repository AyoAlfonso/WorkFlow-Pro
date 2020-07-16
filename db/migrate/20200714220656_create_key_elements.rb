class CreateKeyElements < ActiveRecord::Migration[6.0]
  def change
    create_table :key_elements do |t|
      t.string :value
      t.datetime :completed_at
      t.references :elementable, polymorphic: true
      t.timestamps
    end
  end
end
