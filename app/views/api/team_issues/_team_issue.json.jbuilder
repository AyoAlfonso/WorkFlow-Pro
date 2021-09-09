json.extract! team_issue, :id, :issue_id, :team_id, :position, :completed_at
json.issue team_issue.issue, partial: "api/issues/issue", as: :issue
