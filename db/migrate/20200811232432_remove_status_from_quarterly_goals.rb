class RemoveStatusFromQuarterlyGoals < ActiveRecord::Migration[6.0]
  def change
    remove_column :quarterly_goals, :status
  end
end
