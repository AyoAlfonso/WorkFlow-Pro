class AddSettingsToTeams < ActiveRecord::Migration[6.0]
  def change
    add_column :teams, :settings, :json, default: {}
  end
end
