class AddDeletedAtKeyElements < ActiveRecord::Migration[6.1]
  def change
    add_column :key_elements, :deleted_at, :datetime
    add_index :key_elements, :deleted_at
    
    remove_index :key_elements, ["elementable_type", "elementable_id"]
    add_index :key_elements, ["elementable_type", "elementable_id"],  where: "deleted_at IS NULL"
  
    remove_index :key_elements, :owned_by_id
    add_index :key_elements, :owned_by_id,  where: "deleted_at IS NULL"
  
  end
end
