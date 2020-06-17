class QuarterlyGoal < ApplicationRecord
  include HasCreator
  include HasOwner

  belongs_to :annual_initiative
  # has_many :milestones
end
