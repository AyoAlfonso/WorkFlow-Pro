class CreateMilestones < ActiveRecord::Migration[6.0]
  def change
    create_table :milestones do |t|
      t.references :created_by, references: :user
      t.references :quarterly_goal, null: false, foreign_key: true
      t.text :description
      t.integer :week
      t.column :progress, :integer, default: 0

      t.timestamps
    end
  end
end
