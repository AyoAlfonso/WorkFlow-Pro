class Milestone < ApplicationRecord
  include HasCreator

  enum progress: [:red, :yellow, :green]
  belongs_to :quarterly_goal

  scope :sort_by_created_at_date, -> { order(created_at: :asc) }
end
