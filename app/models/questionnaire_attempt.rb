class QuestionnaireAttempt < ApplicationRecord
  include JournalEntryHelper
  belongs_to :user
  belongs_to :questionnaire
  belongs_to :questionnaire_attemptable, polymorphic: true, optional: true

  serialize :answers, Array
  serialize :steps, Array
  serialize :rendered_steps, Array

  validates_with QuestionnaireAttemptValidator, on: :create

  scope :within_last_week, -> (current_time) { where(completed_at: current_time.last_week.beginning_of_week..current_time.last_week.end_of_week) }
  scope :within_day, -> (current_time) { where(completed_at: current_time.beginning_of_day..current_time.end_of_day)}
  scope :within_current_week, -> (current_time) { where(completed_at: current_time.beginning_of_week..current_time.end_of_week) }
  scope :within_last_four_weeks, -> (current_time) { where(completed_at: current_time.beginning_of_week.days_ago(28)..current_time.beginning_of_week) }
  scope :of_questionnaire_type, -> (questionnaire_name) { joins(:questionnaire).where(questionnaires: { name: questionnaire_name }) }
  scope :of_questionnaire, -> (questionnaire) { where(questionnaire: questionnaire) }
  scope :for_user, -> (user) { where(user_id: user.id) }

  scope :sort_by_completed_at, -> { order(completed_at: :desc) }

  def find_answer_by_id_string(string)
    self.rendered_steps.detect { |rs| rs[:id] == string }
  end

  def get_questionnaire_version_when_completed
    self.questionnaire.paper_trail.version_at(self.completed_at)
  end

  def journal_format
    self.rendered_steps ? questionnaire_attempt_to_text(self.rendered_steps) : ""
  end

  def save_and_create_journal_entry
    ActiveRecord::Base.transaction do
      save!
      parsed_body = questionnaire_attempt_to_text(self.rendered_steps)
      JournalEntry.create!(generated_from_type: self.class.name, generated_from_id: self.id, body: parsed_body, user_id: self.user_id) if parsed_body.present?
    end
    
  end
end
