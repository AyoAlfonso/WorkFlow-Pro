class AddTargetValueAndTitleToKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    change_column :key_performance_indicators, :target_value, :float, :precision => 15, :scale => 2
    add_column :key_performance_indicators, :title, :string
  end
end
