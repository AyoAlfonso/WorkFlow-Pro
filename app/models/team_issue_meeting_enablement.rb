class TeamIssueMeetingEnablement < ApplicationRecord
  belongs_to :meeting
  belongs_to :team_issue

  scope :for_team, -> (team_id) { where(team_id: team_id) }

  validates(:meeting_id, uniqueness: { scope: :team_issue, message: "Already on this scheduled meeting"})
end
