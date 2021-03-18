json.partial! 'api/teams/team', team: @team
json.users @team.users do |user|
  json.partial! 'api/users/user', user: user
  json.todays_priorities user.todays_priorities(current_company)
  json.todays_completed_activities user.todays_completed_activities(current_company)
  json.current_daily_log user.current_daily_log(current_company)
end
json.average_weekly_user_emotions @average_weekly_user_emotions
json.average_team_emotion_score @average_team_emotion_score