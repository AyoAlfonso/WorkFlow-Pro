class TeamIssue < ApplicationRecord
  belongs_to :team
  belongs_to :issue

  acts_as_list scope: :team_id, add_new_at: :top
  
  scope :for_team, -> (team_id) { where(team_id: team_id) }
  scope :sort_by_position, -> { order(position: :asc) }
end
