class AddCompletedAtToTeamIssue < ActiveRecord::Migration[6.0]
  def change
    add_column :team_issues, :completed_at, :string
  end

  def data
    Issue.where.not(team_id: nil).where.not(completed_at: nil).sort_by_position_and_priority_and_created_at_and_completed_at.each.with_index(1) do |issue, index|
      @team_issue = TeamIssue.all.detect { |ti| ti.issue_id == issue.id }
      @team_issue.completed_at = issue.completed_at
      @team_issue.save!
    end
  end
end
