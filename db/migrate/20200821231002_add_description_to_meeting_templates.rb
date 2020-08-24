class AddDescriptionToMeetingTemplates < ActiveRecord::Migration[6.0]
  def change
    add_column :meeting_templates, :description, :text
  end
end
