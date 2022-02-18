class CreateKeyPerformanceIndicators < ActiveRecord::Migration[6.0]
  def change
    create_table :key_performance_indicators do |t|
      t.string :description
      t.datetime :closed_at
      t.references :created_by, references: :user
      #t.references :user, references: :user, foreign_key: true
      #t.references :company, foreign_key: true
      #t.references :team, foreign_key: true
      
      t.timestamps
    end
  end
end
