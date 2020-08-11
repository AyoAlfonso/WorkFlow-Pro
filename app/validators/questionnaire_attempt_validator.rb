class QuestionnaireAttemptValidator < ActiveModel::Validator
  def validate(record)
    questionnaire_type = Questionnaire.find(record.questionnaire_id)
    if questionnaire_type.daily_limit == true
      record.errors[:base] << "Already Completed #{questionnaire_type.name} Today" if record.user.questionnaire_attempts.detect{ |qa| qa.questionnaire.name == questionnaire_type.name && qa.completed_at.to_date == Date.today }
    end
  end
end