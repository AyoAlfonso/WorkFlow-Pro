class AddStatusToQuarterlyGoals < ActiveRecord::Migration[6.0]
  def change
    add_column :quarterly_goals, :status, :integer, default: 0
    add_column :milestones, :status, :integer, default: 0
  end
end
