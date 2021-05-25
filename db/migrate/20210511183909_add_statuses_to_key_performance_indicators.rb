class AddStatusesToKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    add_column :key_performance_indicators, :unit_type, :integer, default: 0
    add_column :key_performance_indicators, :status, :integer, default: 0  
  end
end
