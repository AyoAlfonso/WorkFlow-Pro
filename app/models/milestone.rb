class Milestone < ApplicationRecord
  include HasCreator

  enum status: { unstarted: 0, incomplete: 1, in_progress: 2, completed: 3 }
  belongs_to :quarterly_goal

  default_scope { order(id: :asc) }

  scope :sort_by_created_at_date, -> { order(created_at: :asc) }
  scope :current_week_for_user, -> (user) { created_by(user).where(
    'week_of >=? AND week_of <= ?', user.time_in_user_timezone().beginning_of_week.to_date, user.time_in_user_timezone().end_of_week.to_date
  ) }
end
