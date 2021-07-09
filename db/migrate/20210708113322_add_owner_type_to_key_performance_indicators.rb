class AddOwnerTypeToKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    add_column :key_performance_indicators, :owner_type, :integer
  end
end
