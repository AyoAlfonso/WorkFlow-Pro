json.extract! team, :id, :name, :company_id, :active, :default_avatar_color
json.team_user_enablements team.team_user_enablements, :role, :user_id