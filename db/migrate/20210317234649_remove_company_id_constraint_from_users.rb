class RemoveCompanyIdConstraintFromUsers < ActiveRecord::Migration[6.0]

  def up 
    change_column :users, :company_id, :bigint, null: true
  end

  def down
    change_column :users, :company_id, :bigint, null: false
  end
end
