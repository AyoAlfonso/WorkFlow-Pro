class TeamIssueMeetingEnablement < ApplicationRecord
  belongs_to :meeting
  belongs_to :team_issue

  validates(:meeting_id, uniqueness: { scope: :team_issue, message: "Already on this scheduled meeting"})
end
