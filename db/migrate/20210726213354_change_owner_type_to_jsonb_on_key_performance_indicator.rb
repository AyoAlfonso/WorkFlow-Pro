class ChangeOwnerTypeToJsonbOnKeyPerformanceIndicator < ActiveRecord::Migration[6.0]
  def change
   change_column :key_performance_indicators, :owner, :jsonb
  end
end
