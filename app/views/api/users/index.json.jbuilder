json.array! @users do |user|
  json.partial! "api/users/user", as: :user, user: user, role: user.role_for(current_company), title: user.title_for(current_company)
end
