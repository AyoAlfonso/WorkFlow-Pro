class CreateUserCompanyEnablements < ActiveRecord::Migration[6.0]
  def change
    create_table :user_company_enablements do |t|
      t.references :company, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
