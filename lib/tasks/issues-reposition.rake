namespace :issues do
  desc "update issue positions"
  task reposition: :environment do
    User.all.each do |user|
      user.issues.complete.sort_by_position.each_with_index do |issue, index|
        issue.update_column :position, index + 1
      end
      user.issues.incomplete.sort_by_position.each_with_index do |issue, index|
        issue.update_column :position, index + 1
      end
    end
    Team.all.each do |team|
      TeamIssue.for_team(team.id).complete.each_with_index do |team_issue, index|
        team_issue.update_column :position, index + 1
      end
      TeamIssue.for_team(team.id).incomplete.each_with_index do |team_issue, index|
        team_issue.update_column :position, index + 1
      end
    end
  end
end