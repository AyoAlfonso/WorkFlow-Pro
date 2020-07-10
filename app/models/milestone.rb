class Milestone < ApplicationRecord
  include HasCreator

  enum status: { not_started: 0, incomplete: 1, in_progress: 2, completed: 3 }
  belongs_to :quarterly_goal

  default_scope { order(id: :asc) }

  scope :sort_by_created_at_date, -> { order(created_at: :asc) }
end
