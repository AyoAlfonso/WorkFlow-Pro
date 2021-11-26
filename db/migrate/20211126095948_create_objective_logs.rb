class CreateObjectiveLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :objective_logs do |t|
      t.references :key_performance_indicator,  null: false, foreign_key: true
      t.references :owned_by, references: :user
      t.integer :score
      t.string :note
      t.integer :objective_id
      t.string :objective_type
      t.integer :fiscal_quarter
      t.integer :fiscal_year
      t.integer :week
      t.timestamps
    end
  end
end
