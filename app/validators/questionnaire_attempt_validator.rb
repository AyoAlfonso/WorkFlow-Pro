class QuestionnaireAttemptValidator < ActiveModel::Validator
  def validate(record)
    questionnaire_type = Questionnaire.find(record.questionnaire_id)
    if questionnaire_type.limit_type == "once_per_day"
      record.errors[:base] << "Already Completed #{questionnaire_type.name} Today" if record.user.questionnaire_attempts.detect { |qa|
        #TODO: Optimize this
        if record.log_date.present?
          current_date = record.user.convert_to_their_timezone(record.log_date).to_date
        else
          current_date = record.user.time_in_user_timezone.to_date
        end
        qa.questionnaire.name == questionnaire_type.name && record.user.convert_to_their_timezone(qa.completed_at).to_date == current_date
      }
    elsif questionnaire_type.limit_type == "once_per_week"
      record.errors[:base] << "Already Completed #{questionnaire_type.name} This Week" if record.user.questionnaire_attempts.detect { |qa|
        qa.questionnaire.name == questionnaire_type.name && record.user.convert_to_their_timezone(qa.completed_at).between?(record.user.time_in_user_timezone.beginning_of_week, record.user.time_in_user_timezone.end_of_week)
      }
    end
  end
end
