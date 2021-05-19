class AddFiscalYearStartAndWeekOfToKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    add_column :key_performance_indicators, :fiscal_year_start, :date
    add_column :key_performance_indicators, :week_of, :date
  end
end
