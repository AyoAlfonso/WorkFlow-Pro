json.array! @my_current_milestones do |milestone|
  json.partial! milestone, partial: 'api/milestones/milestone', as: :milestone
  json.quarterly_goal_description milestone.quarterly_goal.description
end