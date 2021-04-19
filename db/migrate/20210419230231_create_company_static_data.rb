class CreateCompanyStaticData < ActiveRecord::Migration[6.0]
  def change
    create_table :company_static_data do |t|
      t.string :field
      t.text :value
      t.references :company, null: false, foreign_key: true
      t.timestamps
    end
  end
end
