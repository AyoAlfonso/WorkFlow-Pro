class CreateProductFeatures < ActiveRecord::Migration[6.0]
  def change
    create_table :product_features do |t|
      t.references :user, null: false, foreign_key: true
      t.boolean :scorecard,  null: false, default: false
      t.boolean :pyns, null: false, default: false
    end
  end
end
