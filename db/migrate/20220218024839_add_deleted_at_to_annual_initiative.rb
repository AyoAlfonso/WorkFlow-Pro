class AddDeletedAtToAnnualInitiative < ActiveRecord::Migration[6.1]
  def change
    add_column :annual_initiatives, :deleted_at, :datetime
    add_index :annual_initiatives, :deleted_at
    
    remove_index  :annual_initiatives, :company_id
    add_index :annual_initiatives, :company_id,  where: "deleted_at IS NULL"
    
    remove_index  :annual_initiatives, :created_by_id
    add_index :annual_initiatives, :created_by_id,  where: "deleted_at IS NULL"
  
    remove_index  :annual_initiatives, :owned_by_id
    add_index :annual_initiatives, :owned_by_id,  where: "deleted_at IS NULL"

  end
end
