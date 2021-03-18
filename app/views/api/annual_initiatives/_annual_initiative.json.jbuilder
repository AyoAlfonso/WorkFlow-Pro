json.extract! annual_initiative, :id, :created_by_id, :owned_by_id, :importance, :key_elements, :company_id, :context_description, :fiscal_year
json.description CGI::unescapeHTML(annual_initiative.description)
json.owned_by do
  json.partial! annual_initiative.owned_by, partial: "api/users/user", as: :user
end

json.quarterly_goals annual_initiative.optimized.quarterly_goals do |quarterly_goal|
  json.partial! quarterly_goal, partial: 'api/quarterly_goals/quarterly_goal', as: :quarterly_goal
end