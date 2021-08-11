class AddOwnedByToKeyPerformanceIndicator < ActiveRecord::Migration[6.0]
  def change
    add_reference :key_performance_indicators, :owned_by, references: :user, null: true
  end
end
