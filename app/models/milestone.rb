class Milestone < ApplicationRecord
  include HasCreator

  enum status: { incomplete: 0, in_progress: 1, completed: 2 }
  belongs_to :quarterly_goal

  scope :sort_by_created_at_date, -> { order(created_at: :asc) }
end
