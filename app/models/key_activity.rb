class KeyActivity < ApplicationRecord
  enum priority: { low: 0, medium: 1, high: 2, frog: 3 }
  belongs_to :user

  scope :created_by_user, -> (user) { where(user: user) }
  scope :sort_by_priority, -> { order(priority: :desc) }
  scope :sort_by_created_date, -> { order(created_at: :asc) }

  def self.sort_by_priority_and_created_at_date
    self.sort_by_priority.sort_by_created_date
  end
end
