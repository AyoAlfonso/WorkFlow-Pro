json.extract! issue, :id, :description, :team_id, :body, :priority, :updated_at, :user_id, :completed_at, :created_at, :position, :labels, :personal, :scheduled_group_id
json.user issue.user, partial: "api/users/user", as: :user
