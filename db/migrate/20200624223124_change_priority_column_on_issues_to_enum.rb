class ChangePriorityColumnOnIssuesToEnum < ActiveRecord::Migration[6.0]
  def change
    remove_column :issues, :priority
    add_column :issues, :priority, :integer
  end
end
