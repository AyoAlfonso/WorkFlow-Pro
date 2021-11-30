class CreateObjectiveLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :objective_logs do |t|
      t.references :owned_by, references: :user
      t.references :objecteable, polymorphic: true, optional: true
      t.integer :score
      t.string :note
      t.integer :fiscal_quarter
      t.integer :fiscal_year
      t.integer :week
      t.timestamps
    end
  end
end
