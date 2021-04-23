json.extract! sub_initiative, :id, :quarterly_goal_id, :created_by_id, :owned_by_id, :importance, :key_elements, :context_description, :quarter, :created_at, :closed_at
json.description sub_initiative.description.present? ? CGI::unescapeHTML(sub_initiative.description) : ""
json.owned_by do
  json.partial! sub_initiative.owned_by, partial: "api/users/user", as: :user
end

json.milestones sub_initiative.milestones do |milestone|
  json.partial! milestone, partial: 'api/milestones/milestone', as: :milestone
end

json.annual_initiative_id sub_initiative.quarterly_goal.annual_initiative_id
