class AddIndexesForDragDrop < ActiveRecord::Migration[6.0]
  def change
    remove_index :key_activities, [:created_at]
    remove_index :key_activities, [:completed_at]
    add_index :key_activities, [:user_id, :weekly_list, :todays_priority, :completed_at, :position], name: 'index_key_activities_scoped_position'
    add_index :key_activities, [:user_id, :weekly_list, :todays_priority, :completed_at, :priority], name: 'index_key_activities_scoped_priority'
    add_index :issues, [:user_id, :position, :completed_at]
    add_index :team_issues, [:team_id, :position, :completed_at]
    add_index :team_issues, [:team_id, :position, :completed_at, :issue_id], name: 'index_team_issues_sort_with_issue_id'
  end
end
