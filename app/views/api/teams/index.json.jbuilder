json.array! @teams do |team|
  json.partial! 'api/teams/team', team: team
  json.users team.users do |user|
    json.partial! 'api/users/user', user: user
    json.todays_priorities user.todays_priorities
  end
end