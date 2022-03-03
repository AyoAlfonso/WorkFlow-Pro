json.extract! quarterly_goal, :id, :annual_initiative_id, :created_by_id, :owned_by_id, :importance, :context_description, :quarter, :created_at, :closed_at
json.description CGI::unescapeHTML(quarterly_goal.description)
json.owned_by do
  json.partial! quarterly_goal.owned_by, partial: "api/users/user", as: :user
end

json.milestones quarterly_goal.milestones do |milestone|
  json.partial! milestone, partial: "api/milestones/milestone", as: :milestone
end

json.key_elements quarterly_goal.key_elements do |key_element|
  json.partial! key_element, partial: "api/key_elements/key_element", as: :key_element
end

json.sub_initiatives quarterly_goal.sub_initiatives do |sub_initiative|
  json.partial! sub_initiative, partial: "api/sub_initiatives/sub_initiative", as: :sub_initiative
end

json.fiscal_year quarterly_goal.annual_initiative.fiscal_year
