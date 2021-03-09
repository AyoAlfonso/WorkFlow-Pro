json.issues @issues, partial: "api/issues/issue", as: :issue
json.team_issues @team_issues, partial: "api/team_issues/team_issue", as: :team_issue
json.meeting_team_issues @meeting_team_issues, partial: "api/issues/issue", as: :issue