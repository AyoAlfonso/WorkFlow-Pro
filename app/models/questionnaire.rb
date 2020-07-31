class Questionnaire < ApplicationRecord
  has_paper_trail
  serialize :steps, Array
end
