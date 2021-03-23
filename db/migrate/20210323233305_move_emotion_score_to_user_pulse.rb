class MoveEmotionScoreToUserPulse < ActiveRecord::Migration[6.0]
  def change
  end


  def data
    questionnaire_id = Questionnaire.find_by_name("Evening Reflection").id
    questionnaire_attempts = QuestionnaireAttempt.where(questionnaire_id: questionnaire_id)

    ts = DateTime.now

    questionnaire_attempts.each do |qa|
      ActiveRecord::Base.connection.execute("INSERT INTO user_pulses (user_id, score, completed_at, created_at, updated_at) VALUES ('#{qa.user_id}', '#{qa.emotion_score}', '#{qa.completed_at}', '#{ts}','#{ts}') RETURNING 'id'")
    end
  end
end
