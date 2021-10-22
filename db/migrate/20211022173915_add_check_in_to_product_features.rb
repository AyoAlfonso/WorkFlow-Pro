class AddCheckInToProductFeatures < ActiveRecord::Migration[6.0]
  def change
    add_column :product_features, :check_in, :boolean, :default => true
  end
end