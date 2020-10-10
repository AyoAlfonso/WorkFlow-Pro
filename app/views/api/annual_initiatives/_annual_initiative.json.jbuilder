json.extract! annual_initiative, :id, :created_by_id, :owned_by_id, :importance, :description, :key_elements, :company_id, :context_description
json.owned_by do
  json.partial! annual_initiative.owned_by, partial: "api/users/user", as: :user
end

json.quarterly_goals annual_initiative.quarterly_goals.present_or_future(@company.current_fiscal_quarter) do |quarterly_goal|
  json.partial! quarterly_goal, partial: 'api/quarterly_goals/quarterly_goal', as: :quarterly_goal
end