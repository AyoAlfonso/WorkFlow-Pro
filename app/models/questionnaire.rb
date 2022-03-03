class Questionnaire < ApplicationRecord
  acts_as_paranoid column: :deleted_at
  serialize :steps, Array
  has_many :questionnaire_attempts, dependent: :destroy

  enum limit_type: { no_limit: 0, once_per_day: 1, once_per_week: 2 }

  has_paper_trail

  def steps_raw
    self.steps.to_json unless self.steps.nil?
  end
end
