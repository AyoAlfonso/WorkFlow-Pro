class AddSchedluingFieldsToMeetings < ActiveRecord::Migration[6.0]
  def change
    add_column :meetings, :scheduled_start_time, :datetime
  end
end
