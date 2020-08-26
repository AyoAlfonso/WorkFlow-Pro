class AddEmotionScoreToQuestionnaireAttempt < ActiveRecord::Migration[6.0]
  def change
    add_column :questionnaire_attempts, :emotion_score, :integer
  end
end
