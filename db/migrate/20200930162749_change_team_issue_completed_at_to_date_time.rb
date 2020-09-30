class ChangeTeamIssueCompletedAtToDateTime < ActiveRecord::Migration[6.0]
  def up
    change_column :team_issues, :completed_at, 'timestamp USING CAST(completed_at AS timestamp)'
  end

  def down
    change_column :team_issues, :completed_at, :string
  end
end
