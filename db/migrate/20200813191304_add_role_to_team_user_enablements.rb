class AddRoleToTeamUserEnablements < ActiveRecord::Migration[6.0]
  def change
    add_column :team_user_enablements, :role, :integer, default: 0
  end
end
