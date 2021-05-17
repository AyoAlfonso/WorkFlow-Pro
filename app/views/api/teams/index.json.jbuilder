json.array! @teams do |team|
  json.partial! 'api/teams/team', team: team
  json.users team.users do |user|
    json.partial! 'api/users/user', user: user
  end
end