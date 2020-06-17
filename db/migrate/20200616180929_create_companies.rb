class CreateCompanies < ActiveRecord::Migration[6.0]
  def change
    create_table :companies do |t|
      t.string :name
      t.string :address
      t.string :contact_email
      t.string :phone_number
      t.text :rallying_cry

      t.timestamps
    end
  end
end
