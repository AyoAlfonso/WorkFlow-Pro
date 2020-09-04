class AddOverrideSettingsToSteps < ActiveRecord::Migration[6.0]
  def change
    add_column :steps, :override_key, :string, index: true
  end
end
