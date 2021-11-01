class TeamUserEnablement < ApplicationRecord

  belongs_to :user
  belongs_to :team

  enum role: { team_member: 0, team_lead: 1 }

  def falsify_all_others_and_update_team_manager
    self.class.where('user_id != ? AND team_id = ?', self.user_id, self.team_id).update_all("team_manager = 'false'")
    self.class.where('user_id = ?', self.user_id).update(team_manager: true)
  end
end
