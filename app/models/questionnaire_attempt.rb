class QuestionnaireAttempt < ApplicationRecord
  belongs_to :user
  belongs_to :questionnaire

  serialize :answers, Array
  serialize :steps, Array
  serialize :rendered_steps, Array

  def get_questionnaire_version_when_completed
    self.questionnaire.paper_trail.version_at(self.completed_at)
  end
end
