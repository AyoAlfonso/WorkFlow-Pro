class TeamIssue < ApplicationRecord
  belongs_to :team
  belongs_to :issue

  acts_as_list scope: [:team_id, :completed_at], add_new_at: :top
  
  scope :for_team, -> (team_id) { where(team_id: team_id) }
  scope :sort_by_position, -> { order(position: :asc) }
  scope :complete, -> { where.not(completed_at: nil) }
  scope :incomplete, -> { where(completed_at: nil) }
end
