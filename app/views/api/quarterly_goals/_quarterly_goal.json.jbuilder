json.extract! quarterly_goal, :id, :annual_initiative_id, :created_by_id, :owned_by_id, :importance, :description, :key_elements, :context_description, :quarter, :created_at
json.owned_by do
  json.partial! quarterly_goal.owned_by, partial: "api/users/user", as: :user
end

json.milestones quarterly_goal.milestones do |milestone|
  json.partial! milestone, partial: 'api/milestones/milestone', as: :milestone
end
