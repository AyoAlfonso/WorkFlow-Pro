json.extract! key_activity, :id, :description, :meeting_id, :position, :priority, :todays_priority, :updated_at, :user_id, :weekly_list, :completed_at, :created_at
json.user key_activity.user, partial: 'api/users/user', as: :user