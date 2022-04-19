json.extract! annual_initiative, :id, :created_by_id, :owned_by_id, :importance, :company_id, :context_description, :fiscal_year, :closed_at, :created_at
json.description CGI::unescapeHTML(annual_initiative.try(:description) || "")
json.owned_by do
  json.partial! annual_initiative.owned_by, partial: "api/users/user", as: :user
end
json.key_elements annual_initiative.key_elements do |key_element|
  json.partial! key_element, partial: "api/key_elements/key_element", as: :key_element
end
# json.derived_status annual_initiative.derived_status
# if the annual_initiative is in the current/future fiscal year then we only want to show present/future quarterly goals
# if the annual_initiative is in the past, then we show all quarterly goals
  if @status == "closed"
      json.quarterly_goals annual_initiative.quarterly_goals.optimized.sort_by_closed do |quarterly_goal|
        json.partial! quarterly_goal, partial: "api/quarterly_goals/quarterly_goals", as: :quarterly_goal
      end
  elsif @status == "open"
      json.quarterly_goals annual_initiative.quarterly_goals.optimized.sort_by_not_closed do |quarterly_goal|
          json.partial! quarterly_goal, partial: "api/quarterly_goals/quarterly_goal", as: :quarterly_goal
      end
  else
      json.quarterly_goals annual_initiative.quarterly_goals.optimized do |quarterly_goal|
      json.partial! quarterly_goal, partial: "api/quarterly_goals/quarterly_goal", as: :quarterly_goal
    end
  end

