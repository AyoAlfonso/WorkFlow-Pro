class AddIndexForCompletedAtForQuestionnaireAttempts < ActiveRecord::Migration[6.0]
  def change
    add_index :questionnaire_attempts, :completed_at
  end
end
