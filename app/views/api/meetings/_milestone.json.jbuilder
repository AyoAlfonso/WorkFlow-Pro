json.extract! milestone, :id, :created_by_id, :created_at, :status, :description, :week, :week_of, :milestoneable_id, :milestoneable_type
json.quarterly_goal_description CGI::unescapeHTML(milestone.milestoneable.description) if milestone.milestoneable.class.name == "QuarterlyGoal"
