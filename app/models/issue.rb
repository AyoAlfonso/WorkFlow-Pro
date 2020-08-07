class Issue < ApplicationRecord
  enum priority: { low: 0, medium: 1, high: 2 }
  belongs_to :user
  belongs_to :team, optional: true

  scope :created_by_user, -> (user) { where(user: user) }
  scope :sort_by_priority, -> { order(priority: :desc) }
  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :sort_by_completed_date, -> { order(completed_at: :asc)}
  
  def self.sort_by_priority_and_created_at_and_completed_at
    self.sort_by_priority.sort_by_created_date.sort_by_completed_date
  end
end
