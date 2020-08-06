class AddTeamToIssues < ActiveRecord::Migration[6.0]
  def change
    add_reference :issues, :team, null: true
  end
end
