class CreateTeamIssueMeetingEnablements < ActiveRecord::Migration[6.0]
  def change
    create_table :team_issue_meeting_enablements do |t|
      t.references :meeting, null: false, foreign_key: true
      t.references :team_issue, null: false, foreign_key: true

      t.timestamps
    end
  end
end
