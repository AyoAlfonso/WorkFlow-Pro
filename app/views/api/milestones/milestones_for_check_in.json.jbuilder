json.array! @quarterly_goal_milestones do |milestone|
  json.partial! milestone, partial: "api/milestones/milestone", as: :milestone
  json.quarterly_goal_description CGI::unescapeHTML(milestone.milestoneable.description)
end

json.array! @subinitiative_milestones do |milestone|
  json.partial! milestone, partial: "api/milestones/milestone", as: :milestone
  json.subinitiative_description CGI::unescapeHTML(milestone.milestoneable.description)
end