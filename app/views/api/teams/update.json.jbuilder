json.teams do
  json.array! @teams do |team|
    json.partial! 'api/teams/team', team: team
    json.users team.users do |user|
      json.partial! 'api/users/user', user: user
      json.todays_priorities user.todays_priorities(current_company).exclude_personal_for_team
      json.todays_completed_activities user.todays_completed_activities(current_company).exclude_personal_for_team
      json.current_daily_log user.current_daily_log(current_company)
    end
  end
end

json.team do
  json.partial! 'api/teams/team', team: @team
  json.users @team.users do |user|
    json.partial! 'api/users/user', user: user
    json.todays_priorities user.todays_priorities(current_company).exclude_personal_for_team
    json.todays_completed_activities user.todays_completed_activities(current_company).exclude_personal_for_team
    json.current_daily_log user.current_daily_log(current_company)
  end
  json.average_weekly_user_emotions @average_weekly_user_emotions
  json.average_team_emotion_score @average_team_emotion_score
end


