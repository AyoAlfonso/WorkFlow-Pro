class AddScheduledGroupIdToIssues < ActiveRecord::Migration[6.0]
  def change
    add_reference :issues, :scheduled_group, null: true
  end
end
