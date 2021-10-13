json.extract! annual_initiative, :id, :created_by_id, :owned_by_id, :importance, :key_elements, :company_id, :context_description, :fiscal_year, :closed_at, :created_at
json.description CGI::unescapeHTML(annual_initiative.description)
json.owned_by do
  json.partial! annual_initiative.owned_by, partial: "api/users/user", as: :user
end

# if the annual_initiative is in the current/future fiscal year then we only want to show present/future quarterly goals
# if the annual_initiative is in the past, then we show all quarterly goals
json.quarterly_goals annual_initiative.quarterly_goals.optimized do |quarterly_goal|
  json.partial! quarterly_goal, partial: "api/quarterly_goals/quarterly_goal", as: :quarterly_goal
end
