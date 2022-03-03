class AddDeletedAtToSubInitiative < ActiveRecord::Migration[6.1]
  add_column :sub_initiatives, :deleted_at, :datetime
  add_index :sub_initiatives, :deleted_at
  
  remove_index :sub_initiatives, :quarterly_goal_id
  add_index :sub_initiatives, :quarterly_goal_id,  where: "deleted_at IS NULL"

  remove_index :sub_initiatives, :created_by_id
  add_index :sub_initiatives, :created_by_id,  where: "deleted_at IS NULL"

  remove_index :sub_initiatives, :owned_by_id
  add_index :sub_initiatives, :owned_by_id,  where: "deleted_at IS NULL"
end
