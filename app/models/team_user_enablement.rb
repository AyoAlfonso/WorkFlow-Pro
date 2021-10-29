class TeamUserEnablement < ApplicationRecord
  belongs_to :user
  belongs_to :team

  enum role: { team_member: 0, team_lead: 1, team_manager: 2 }
end
