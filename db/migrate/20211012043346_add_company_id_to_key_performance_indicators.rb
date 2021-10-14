class AddCompanyIdToKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    add_reference :key_performance_indicators, :company, null: true
  end
end
