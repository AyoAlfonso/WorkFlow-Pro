json.extract! issue, :id, :description, :team_id, :topic_type, :body, :priority, :updated_at, :user_id, :completed_at, :created_at, :position, :labels, :personal, :scheduled_group_id, :cached_votes_total, :upvoters, :due_date
json.user issue.user, partial: "api/users/user", as: :user
