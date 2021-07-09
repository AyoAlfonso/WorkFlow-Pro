class AddGreaterThanToKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    add_column :key_performance_indicators, :greater_than, :boolean
  end
end
