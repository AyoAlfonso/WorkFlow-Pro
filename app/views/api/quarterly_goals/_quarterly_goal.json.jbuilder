json.extract! quarterly_goal, :id, :annual_initiative_id, :created_by_id, :owned_by_id, :importance, :key_elements, :context_description, :quarter, :created_at, :closed_at
json.description CGI::unescapeHTML(quarterly_goal.description)
json.owned_by do
  json.partial! quarterly_goal.owned_by, partial: "api/users/user", as: :user
end

json.milestones quarterly_goal.milestones do |milestone|
  json.partial! milestone, partial: 'api/milestones/milestone', as: :milestone
end

json.sub_initiative do
  json.partial! quarterly_goal.sub_initiative, partial: "api/sub_initiatives/sub_initiative", as: :sub_initiative if quarterly_goal.sub_initiative.present?
end