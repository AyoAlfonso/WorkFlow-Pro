class AddDeletedStatusToTeams < ActiveRecord::Migration[6.1]
  def change
   add_column :teams, :deleted, :boolean, default: false
   add_index :teams, :company_id, where: "deleted_at IS NULL"
  end
end
