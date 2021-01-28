json.array! @annual_initiatives do |annual_initiative|
  json.extract! annual_initiative, :id, :created_by_id, :owned_by_id, :importance, :description, :key_elements, :company_id, :context_description
  json.owned_by annual_initiative.owned_by
  json.quarterly_goals annual_initiative.quarterly_goals.filter_by_team_id(@team_id).present_or_future(@company) do |quarterly_goal|
    json.extract! quarterly_goal, :id, :annual_initiative_id, :created_by_id, :owned_by_id, :importance, :description, :key_elements, :context_description, :quarter, :created_at
    json.owned_by quarterly_goal.owned_by
    json.milestones quarterly_goal.milestones do |milestone|
      json.extract! milestone, :id, :created_by_id, :quarterly_goal_id, :description, :week, :status, :week_of, :created_at
    end
  end
end