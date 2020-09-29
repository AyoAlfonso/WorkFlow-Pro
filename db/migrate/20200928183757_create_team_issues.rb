class CreateTeamIssues < ActiveRecord::Migration[6.0]
  def change
    create_table :team_issues do |t|
      t.references :issue
      t.references :team
      t.integer :position
      t.string :completed_at

      t.timestamps
    end
  end

  def data
    Issue.where.not(team_id: nil).sort_by_position_and_priority_and_created_at_and_completed_at.each.with_index(1) do |issue, index|
      TeamIssue.where(issue_id: issue.id).first_or_create!(issue_id: issue.id, team_id: issue.team_id, position: index, completed_at: issue.completed_at)
    end
  end
end
