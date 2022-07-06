class CreateCheckInArtifactLog < ActiveRecord::Migration[6.1]
  def change
    create_table :check_in_artifact_logs do |t|
      t.references :check_in_artifact, references: :check_in_artifacts
      t.jsonb :responses
      t.references :created_by, references: :user
      t.references :scorecard_log, references: :scorecard_logs
      t.references :objective_log, references: :objective_logs
      t.datetime :deleted_at
      t.timestamps
    end
  end
end
