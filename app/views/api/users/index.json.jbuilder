json.array! @users do |user|
  json.partial! user, partial: 'api/users/user', as: :user
  json.todays_priorities user.todays_priorities
  json.todays_completed_activities user.todays_completed_activities
  json.current_daily_log user.current_daily_log
end