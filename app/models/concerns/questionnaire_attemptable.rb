module QuestionnaireAttemptable
  extend ActiveSupport::Concern

  included do
    has_one :questionnaire_attempt, as: :questionnaire_attemptable
  end
end