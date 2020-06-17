class ThoughtChallenge < ApplicationRecord
  enum cognitive_distortions: []

  belongs_to :personal_reflection
  # need clarification here
end
