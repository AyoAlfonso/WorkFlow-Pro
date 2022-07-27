class RemoveQuestionsFieldFromCheckInArtifact < ActiveRecord::Migration[6.1]
  def change
    remove_column :check_in_artifacts, :questions
  end
end
