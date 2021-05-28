class CreateKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    create_table :key_performance_indicators do |t|
      
      t.string :description
      t.datetime :closed_at
      t.references :created_by, references: :user 
      t.references :owned_by, references: :user

      t.timestamps
    end
  end
end
