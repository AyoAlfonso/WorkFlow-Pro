class AddStatusesAndTargetValueToKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    add_column :key_performance_indicators, :unit_type, :integer, default: 'numerical'
    add_column :key_performance_indicators, :target_value, :integer, default: 0 
  end
end
