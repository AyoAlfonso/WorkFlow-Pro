class AddDueDateToIssues < ActiveRecord::Migration[6.1]
  def change
    add_column :issues, :due_date, :datetime, null: true
  end
end
