class QuestionnaireAttempt < ApplicationRecord
  belongs_to :user
  belongs_to :questionnaire
  belongs_to :questionnaire_attemptable, polymorphic: true, optional: true

  serialize :answers, Array
  serialize :steps, Array
  serialize :rendered_steps, Array

  validates_with QuestionnaireAttemptValidator, on: :create

  scope :within_last_week, -> (current_time) { where(completed_at: current_time.last_week.beginning_of_week..current_time.last_week.end_of_week) }
  scope :within_current_week, -> (current_time) { where(completed_at: current_time.beginning_of_week..current_time.end_of_week) }
  scope :of_questionnaire_type, -> (questionnaire_name) { joins(:questionnaire).where(questionnaires: { name: questionnaire_name }) }
  scope :for_user, -> (user) { where(user_id: user.id) }

  scope :sort_by_completed_at, -> { order(completed_at: :desc) }

  def find_answer_by_id_string(string)
    self.rendered_steps.detect { |rs| rs[:id] == string }
  end

  def get_questionnaire_version_when_completed
    self.questionnaire.paper_trail.version_at(self.completed_at)
  end
end
