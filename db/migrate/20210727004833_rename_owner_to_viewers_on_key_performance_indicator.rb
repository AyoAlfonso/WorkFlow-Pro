class RenameOwnerToViewersOnKeyPerformanceIndicator < ActiveRecord::Migration[6.0]
  def change
    rename_column :key_performance_indicators, :owner, :viewers
  end
end
