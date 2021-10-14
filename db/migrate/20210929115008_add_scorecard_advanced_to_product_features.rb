class AddScorecardAdvancedToProductFeatures < ActiveRecord::Migration[6.0]
  def change
     add_column :product_features, :scorecard_pro, :boolean, :default => false
  end
end
