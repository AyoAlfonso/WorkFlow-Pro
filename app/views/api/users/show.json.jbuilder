json.partial! @user, partial: 'api/users/user', as: :user
json.todays_priorities @user.todays_priorities(current_company)
json.todays_completed_activities @user.todays_completed_activities(current_company)
json.current_daily_log @user.current_daily_log(current_company)