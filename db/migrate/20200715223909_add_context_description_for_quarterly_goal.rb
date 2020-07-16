class AddContextDescriptionForQuarterlyGoal < ActiveRecord::Migration[6.0]
  def change
    add_column :quarterly_goals, :context_description, :string
  end
end
