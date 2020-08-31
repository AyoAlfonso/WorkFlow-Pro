class Questionnaire < ApplicationRecord
  serialize :steps, Array
  has_many :questionnaire_attempts

  has_paper_trail

  def steps_raw
    self.steps.to_json unless self.steps.nil?
  end
end
