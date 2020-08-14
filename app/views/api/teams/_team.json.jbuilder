json.extract! team, :id, :name, :company_id, :active
json.team_user_enablements team.team_user_enablements, :role, :user_id