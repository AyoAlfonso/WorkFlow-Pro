json.array! @quarterly_goal_key_result do |key_results|
  json.partial! key_result, partial: "api/key_results/key_result", as: :key_result
end

json.array! @subinitiative_milestones do |key_results|
  json.partial! key_result, partial: "api/key_results/key_result", as: :key_result
end

json.array! @annualInitiative_key_results do |key_results|
  json.partial! key_result, partial: "api/key_results/key_result", as: :key_result
end