json.partial! partial: "api/users/user", as: :user, user: @user, role: @user.role_for(current_company), title: @user.title_for(current_company)
json.todays_priorities @user.todays_priorities(current_company)
json.todays_completed_activities @user.todays_completed_activities(current_company)
json.current_daily_log @user.current_daily_log(current_company)
json.static_data @static_data
json.company_id @user.default_selected_company.id
json.company_name @user.default_selected_company.name
json.session_company_profile_id @session_company_id
json.first_access_to_forum @user_first_access_to_forum
json.scheduled_groups @scheduled_groups
json.provider @user.provider
json.stats_for_month = @stats_for_month
json.stats_for_week = @stats_for_week

json.current_company_user_teams @user.user_teams_for_company_or_full_access(current_company).includes([:team_user_enablements]) do |team|
  json.partial! team, partial: "api/teams/team", as: :team
end
json.current_company_onboarded current_company.complete?

json.company_profiles @user.companies.where(onboarding_status: 1) do |company|
  json.extract! company, :id, :name, :display_format
end

json.company_static_data current_company.company_static_datas do |company_static_data|
  json.extract! company_static_data, :id, :field, :value
end
