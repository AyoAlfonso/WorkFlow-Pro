class SetDefaultPriorityForIssue < ActiveRecord::Migration[6.0]
  def change
    change_column :issues, :priority, :integer, default: 0
  end
end
