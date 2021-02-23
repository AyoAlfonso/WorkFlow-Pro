json.extract! issue, :id, :description, :team_id, :priority, :updated_at, :user_id, :completed_at, :created_at, :position, :labels
json.user issue.user, partial: 'api/users/user', as: :user