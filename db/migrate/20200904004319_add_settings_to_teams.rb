class AddSettingsToTeams < ActiveRecord::Migration[6.0]
  def change
    enable_extension 'hstore' unless extension_enabled?('hstore')
    add_column :teams, :settings, :hstore, default: {}
  end
end
