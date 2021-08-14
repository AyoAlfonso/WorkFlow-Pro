class ChangeTargetValueToFloatKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def up
    change_column :key_performance_indicators, :target_value, :float
  end
  def down
    change_column :key_performance_indicators, :target_value, :integer
  end
end
