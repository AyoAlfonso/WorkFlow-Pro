class QuarterlyGoal < ApplicationRecord
  include HasCreator
  include HasOwner

  enum status: { incomplete: 0, in_progress: 1, completed: 2 }

  belongs_to :annual_initiative
  has_many :milestones, dependent: :destroy

  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :owned_by_user, -> (user) { where(owned_by_id: user.id) }
end
