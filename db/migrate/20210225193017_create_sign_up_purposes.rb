class CreateSignUpPurposes < ActiveRecord::Migration[6.0]
  def change
    create_table :sign_up_purposes do |t|
      t.references :company, null: false, foreign_key: true
      t.string :purpose

      t.timestamps
    end
  end
end
