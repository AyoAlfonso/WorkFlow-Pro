class ChangeObjectiveLogIdAndScorecardLogIdToArraysInCheckInArtifact < ActiveRecord::Migration[6.1]
  def change
    add_column :check_in_artifact_logs, :objective_logs, :integer, array: true, default: [] 
    add_column :check_in_artifact_logs, :scorecard_logs, :integer, array: true, default: [] 
    remove_column :check_in_artifact_logs, :scorecard_log_id 
    remove_column :check_in_artifact_logs, :objective_log_id 
  end
end
