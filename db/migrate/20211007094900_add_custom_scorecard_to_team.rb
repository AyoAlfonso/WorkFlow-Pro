class AddCustomScorecardToTeam < ActiveRecord::Migration[6.0]
  def change
  	add_column :teams, :custom_scorecard, :boolean, default: false
  end
end
