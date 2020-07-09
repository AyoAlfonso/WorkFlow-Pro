class RemoveProgressFromMilestone < ActiveRecord::Migration[6.0]
  def change
    remove_column :milestones, :progress
  end
end
