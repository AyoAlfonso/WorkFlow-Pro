class AddTeamManagerToTeamUserEnablements < ActiveRecord::Migration[6.1]
  def change
      add_column :team_user_enablements, :team_manager, :boolean, default: false
  end
end
