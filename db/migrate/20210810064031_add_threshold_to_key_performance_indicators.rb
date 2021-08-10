class AddThresholdToKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    add_column :key_performance_indicators, :needs_attention_threshold, :float, :precision => 15, :scale => 2, null: false
  end
end
