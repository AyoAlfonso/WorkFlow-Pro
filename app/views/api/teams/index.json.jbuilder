json.array! @teams do |team|
  json.partial! 'api/teams/team', team: team
  json.users team.users do |user|
    json.partial! 'api/users/user', user: user
    json.todays_priorities user.todays_priorities
  end
  json.average_weekly_user_emotions team.weekly_average_users_emotion_score
  json.average_team_emotion_score team.team_average_weekly_emotion_score
end