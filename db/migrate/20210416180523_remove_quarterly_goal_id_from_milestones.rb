class RemoveQuarterlyGoalIdFromMilestones < ActiveRecord::Migration[6.0]
  def change
    remove_column :milestones, :quarterly_goal_id
  end
end
