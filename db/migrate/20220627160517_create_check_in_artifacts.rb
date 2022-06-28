class CreateCheckInArtifacts < ActiveRecord::Migration[6.1]
  def change
    create_table :check_in_artifacts do |t|
      t.references :owned_by, references: :user
      t.references :check_in_template, references: :check_in_template
      t.boolean :skip, default: false, nil: false
      t.datetime :end_time
      t.datetime :start_time
      t.datetime :deleted_at
      t.jsonb :questions
      t.timestamps
    end
  end
end
