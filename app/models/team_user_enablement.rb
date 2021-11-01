class TeamUserEnablement < ApplicationRecord
  before_save :falsify_all_others
  
  belongs_to :user
  belongs_to :team

  enum role: { team_member: 0, team_lead: 1 }

  def falsify_all_others
    self.class.where('id != ? AND team_id = ?', self.id, self.team_id).update_all("team_manager = 'false'")
  end
end
