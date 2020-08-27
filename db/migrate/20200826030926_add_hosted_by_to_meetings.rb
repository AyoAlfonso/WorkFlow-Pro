class AddHostedByToMeetings < ActiveRecord::Migration[6.0]
  def change
    add_reference :meetings, :hosted_by, null: true, foreign_key: { to_table: :users }
    change_column_null :meetings, :team_id, true
  end
end
