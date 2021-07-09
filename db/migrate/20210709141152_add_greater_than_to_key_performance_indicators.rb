class AddGreaterThanToKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    add_column :key_performance_indicators, :greater_than, :boolean, default: true
    add_reference :key_performance_indicators, :owned_by, references: :user, null: true
  end
end
