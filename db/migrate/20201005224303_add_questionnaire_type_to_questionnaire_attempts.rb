class AddQuestionnaireTypeToQuestionnaireAttempts < ActiveRecord::Migration[6.0]
  def change
    add_column :questionnaire_attempts, :questionnaire_type, :string
  end

  def data
    QuestionnaireAttempt.all.each do |qa|
      questionnaire = Questionnaire.find(qa.questionnaire_id)
      qa.questionnaire_type = questionnaire.name
      qa.save!
    end
  end
end
