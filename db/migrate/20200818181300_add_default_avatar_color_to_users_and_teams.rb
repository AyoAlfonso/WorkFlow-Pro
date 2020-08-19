class AddDefaultAvatarColorToUsersAndTeams < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :default_avatar_color, :string
    add_column :teams, :default_avatar_color, :string
  end
end
