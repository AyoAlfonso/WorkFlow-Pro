class AddIndexesToMeetingsForCreationDateAndStartTime < ActiveRecord::Migration[6.0]
  def change
    add_index :meetings, :created_at
    add_index :meetings, :start_time
  end
end
