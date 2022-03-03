class AddDeletedAtToTeams < ActiveRecord::Migration[6.1]
  def change
    add_column :teams, :deleted_at, :datetime
    add_index :teams, :deleted_at
    
    remove_index  :teams, :company_id
    add_index :teams, :company_id,  where: "deleted_at IS NULL"
  end
end
