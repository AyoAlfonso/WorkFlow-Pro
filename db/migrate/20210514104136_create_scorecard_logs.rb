class CreateScorecardLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :scorecard_logs do |t|
      t.references :key_performance_indicator,  null: false, foreign_key: true
      t.integer :score
      t.string :note
      t.references :user,  null: false, foreign_key: true
      t.timestamps
    end
  end
end