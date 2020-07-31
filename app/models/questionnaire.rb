class Questionnaire < ApplicationRecord
  serialize :steps, Array
  has_many :questionnaire_attempts

  has_paper_trail
end
