json.user do
  json.personal_vision @personal_vision
  json.goals @user_goals do |goal|
    json.partial! goal, partial: "api/annual_initiatives/annual_initiative", as: :annual_initiative
  end
end

json.company do
  json.rallying_cry @company[:rallying_cry]
  json.goals @company_goals do |goal|
      json.partial! goal, partial: "api/annual_initiatives/annual_initiative", as: :annual_initiative
  end
end
