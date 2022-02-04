class AddStatusToObjectiveLogs < ActiveRecord::Migration[6.1]
  def change
    add_column :objective_logs, :status, :integer, default: 0
  end
end
