class AddOwnerToKeyPerformanceIndicator < ActiveRecord::Migration[6.0]
  def change
    add_column :key_performance_indicators, :owner, :json
    remove_column :key_performance_indicators, :owned_by_id
  end
end