class AddWeekOfForMilestones < ActiveRecord::Migration[6.0]
  def change
    add_column :milestones, :week_of, :date
  end
end
