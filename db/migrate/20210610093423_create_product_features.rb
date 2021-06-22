class CreateProductFeatures < ActiveRecord::Migration[6.0]
  def change
    create_table :product_features do |t|
      t.references :user, null: false, foreign_key: true
      t.boolean :objective, null: false, default: true
      t.boolean :team, null: false, default: false
      t.boolean :meeting, null: false, default: false
      t.boolean :company, null: false, default: false
      t.boolean :pyns, null: false, default: false
    end
  end
end
