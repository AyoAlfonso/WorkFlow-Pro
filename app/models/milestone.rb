class Milestone < ApplicationRecord
  include HasCreator

  enum status: { unstarted: 0, incomplete: 1, in_progress: 2, completed: 3 }
  belongs_to :quarterly_goal

  default_scope { order(id: :asc) }

  scope :sort_by_created_at_date, -> { order(created_at: :asc) }
  
  scope :current_week_for_user, -> (week_start, user) { joins(:quarterly_goal).where(quarterly_goals: {owned_by: user}).where(
    'week_of >=? AND week_of < ?', week_start.to_date, week_start.end_of_week.to_date
  ) }

  scope :by_start_and_end_date, -> (start_date, end_date) {
    where('week_of >=? AND week_of <= ?', start_date, end_date)
  }

  #TODO: ADD THE YEAR FOR THE QUARTER AS WELL
  scope :for_user_on_quarter, -> (user, quarter) { joins(:quarterly_goal).where(quarterly_goals: {owned_by: user, quarter: quarter}) }

  delegate :description, to: :quarterly_goal, prefix: true


  def self.for_users_in_team_and_quarter(team_id, quarter)
    quarterly_goal_ids = QuarterlyGoal.filter_by_team_id(team_id).for_quarter(quarter).pluck(:id)
    self.where(quarterly_goal_id: quarterly_goal_ids)
  end
end
