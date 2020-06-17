class CreateIssues < ActiveRecord::Migration[6.0]
  def change
    create_table :issues do |t|
      t.references :user, null: false, foreign_key: true
      t.text :description
      t.datetime :completed_at
      t.string :priority

      t.timestamps
    end
  end
end
