class AddJournalLogsToCheckInArtifactLogs < ActiveRecord::Migration[6.1]
  def change
    add_column :check_in_artifact_logs, :journal_logs, :integer, array: true, default: [] 
  end
end
