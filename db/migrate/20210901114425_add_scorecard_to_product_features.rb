class AddScorecardToProductFeatures < ActiveRecord::Migration[6.0]
  def change
    add_column :product_features, :scorecard, :boolean, :default => false
  end
  
end
