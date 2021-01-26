class AddSettingsToMeetings < ActiveRecord::Migration[6.0]
  def change
    add_column :meetings, :settings, :json
  end
end
