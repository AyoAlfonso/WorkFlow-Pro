class AddPositionToIssue < ActiveRecord::Migration[6.0]
  def change
    add_column :issues, :position, :integer
  end

  def data
    User.all.each do |user|
      user.issues.sort_by_position_and_priority_and_created_at_and_completed_at.each.with_index(1) do |issue, index|
        issue.update_column :position, index
      end
    end
  end
end
