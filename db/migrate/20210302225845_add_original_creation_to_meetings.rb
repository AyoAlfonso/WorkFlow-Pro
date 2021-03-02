class AddOriginalCreationToMeetings < ActiveRecord::Migration[6.0]
  def change
    add_column :meetings, :original_creation, :boolean, default: false
  end
end
