class AddNotesToMeeting < ActiveRecord::Migration[6.0]
  def change
    add_column :meetings, :notes, :text
  end
end
