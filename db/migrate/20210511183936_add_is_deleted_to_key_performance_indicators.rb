class AddIsDeletedToKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    add_column :key_performance_indicators, :is_deleted, :boolean, default: false
  end
end
