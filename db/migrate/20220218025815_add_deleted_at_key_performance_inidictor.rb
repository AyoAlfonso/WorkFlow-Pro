class AddDeletedAtKeyPerformanceInidictor < ActiveRecord::Migration[6.1]
  def change
    add_column :key_performance_indicators, :deleted_at, :datetime
    add_index :key_performance_indicators, :deleted_at
    
    remove_index :key_performance_indicators, :company_id
    add_index :key_performance_indicators, :company_id,  where: "deleted_at IS NULL"
  
    remove_index :key_performance_indicators, :created_by_id
    add_index :key_performance_indicators, :created_by_id,  where: "deleted_at IS NULL"
  
    remove_index :key_performance_indicators, :owned_by_id
    add_index :key_performance_indicators, :owned_by_id,  where: "deleted_at IS NULL"
  end
end
