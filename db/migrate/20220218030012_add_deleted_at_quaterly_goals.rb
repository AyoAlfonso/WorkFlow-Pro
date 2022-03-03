class AddDeletedAtQuaterlyGoals < ActiveRecord::Migration[6.1]
  add_column :quarterly_goals, :deleted_at, :datetime
  add_index :quarterly_goals, :deleted_at
  
  remove_index :quarterly_goals, :annual_initiative_id
  add_index :quarterly_goals, :annual_initiative_id,  where: "deleted_at IS NULL"

  remove_index :quarterly_goals, :created_by_id
  add_index :quarterly_goals, :created_by_id,  where: "deleted_at IS NULL"

  remove_index :quarterly_goals, :owned_by_id
  add_index :quarterly_goals, :owned_by_id,  where: "deleted_at IS NULL"
end
