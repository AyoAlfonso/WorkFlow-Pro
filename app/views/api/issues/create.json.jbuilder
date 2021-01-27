json.issues @issues_to_render, partial: "api/issues/issue", as: :issue
json.team_issues @team_issues, partial: "api/team_issues/team_issue", as: :team_issue
json.forum_meeting_team_issues @forum_meeting_issues, partial: "api/issues/issue", as: :issue