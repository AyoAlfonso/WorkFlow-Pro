json.partial! @user, partial: 'api/users/user', as: :user
json.todays_priorities @user.todays_priorities
json.todays_completed_activities @user.todays_completed_activities
json.current_daily_log @user.current_daily_log
json.static_data @static_data
json.company_id @user.current_selected_company.id
json.company_name @user.current_selected_company.name
json.session_company_profile_id @session_company_id

json.company_profiles @user.companies do |company|
  json.extract! company, :id, :name, :display_format
end