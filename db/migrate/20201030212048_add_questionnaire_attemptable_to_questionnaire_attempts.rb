class AddQuestionnaireAttemptableToQuestionnaireAttempts < ActiveRecord::Migration[6.0]
  def change
    add_reference :questionnaire_attempts, :questionnaire_attemptable, polymorphic: true, null: true, index: { name: 'index_on_questionnaire_attemptable_id_and_type' }
  end
end
