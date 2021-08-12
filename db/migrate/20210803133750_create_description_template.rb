class CreateDescriptionTemplate < ActiveRecord::Migration[6.0]
  def change
    create_table :description_templates do |t|
      t.string :title
      t.integer :template_type
      t.text :body
    end
  end
end
