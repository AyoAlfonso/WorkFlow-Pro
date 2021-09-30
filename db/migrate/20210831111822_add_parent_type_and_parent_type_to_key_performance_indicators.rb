class AddParentTypeAndParentTypeToKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    add_column :key_performance_indicators, :parent_type, :integer
    add_column :key_performance_indicators, :parent_kpi,  :integer, array: true, default: [] 
  end
end
