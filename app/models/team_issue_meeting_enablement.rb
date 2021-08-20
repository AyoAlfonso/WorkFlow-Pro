class TeamIssueMeetingEnablement < ApplicationRecord
  belongs_to :meeting
  belongs_to :team_issue

  validates(:team_issue, uniqueness: { scope: :meeting_id, message: "Already on this scheduled meeting" })
end
