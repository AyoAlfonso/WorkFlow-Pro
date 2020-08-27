json.partial! 'api/teams/team', team: @team
json.users @team.users do |user|
  json.partial! 'api/users/user', user: user
  json.todays_priorities user.todays_priorities
end
json.average_weekly_user_emotions @average_weekly_user_emotions
json.average_team_emotion_score @average_team_emotion_score