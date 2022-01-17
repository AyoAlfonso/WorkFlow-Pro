class AddChildIdAndChildTypeToObjectiveLogs < ActiveRecord::Migration[6.1]
  def change
    add_column :objective_logs, :child_id, :integer, null: true
    add_column :objective_logs, :child_type, :string, null: true
  end
end
