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
    TeamIssue.complete.each_with_index do |team_issue, index|
      team_issue.update_column :position, index + 1
    end
    TeamIssue.incomplete.each_with_index do |team_issue, index|
      team_issue.update_column :position, index + 1
    end
  end
end