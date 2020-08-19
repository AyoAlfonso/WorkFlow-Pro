class AddStartTimeCurrentStepHostNameToMeetings < ActiveRecord::Migration[6.0]
  def change
    add_column :meetings, :start_time, :datetime
    add_column :meetings, :current_step, :integer
    add_column :meetings, :host_name, :string
  end
end
