json.extract! key_activity, :id, :description, :body, :meeting_id, :position, :priority, :updated_at, :user_id, :completed_at, :created_at, :due_date, :labels, :personal, :scheduled_group_id, :team_id, :moved_to_today_on
json.user key_activity.user, partial: "api/users/user", as: :user
