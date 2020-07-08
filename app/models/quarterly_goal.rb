class QuarterlyGoal < ApplicationRecord
  include HasCreator
  include HasOwner

  belongs_to :annual_initiative
  has_many :milestones, dependent: :destroy

  scope :sort_by_created_date, -> { order(created_at: :asc) }
end
