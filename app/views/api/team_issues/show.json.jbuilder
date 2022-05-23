# json.extract! new_issue, :id, :issue_id, :team_id, :position, :completed_at
json.issue @issue.issue, partial: "api/issues/issue", as: :issue
json.partial! @issue, partial:  "api/issues/issue", as: :issue