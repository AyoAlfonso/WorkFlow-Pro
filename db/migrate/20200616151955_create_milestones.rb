class CreateMilestones < ActiveRecord::Migration[6.0]
  def change
    create_table :milestones do |t|
      t.references :created_by_id, references: :user
      t.text :description
      t.date :week
      t.column :progress, :integer, default: 0

      t.timestamps
    end
  end
end
