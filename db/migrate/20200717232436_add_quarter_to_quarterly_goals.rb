class AddQuarterToQuarterlyGoals < ActiveRecord::Migration[6.0]
  def change
    add_column :quarterly_goals, :quarter, :integer
  end
end
