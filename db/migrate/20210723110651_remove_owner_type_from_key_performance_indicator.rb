class RemoveOwnerTypeFromKeyPerformanceIndicator < ActiveRecord::Migration[6.0]
  def change
    remove_column :key_performance_indicators, :owner_type
  end
end
