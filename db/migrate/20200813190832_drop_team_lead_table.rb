class DropTeamLeadTable < ActiveRecord::Migration[6.0]
  def change
    drop_table :team_leads
  end
end
