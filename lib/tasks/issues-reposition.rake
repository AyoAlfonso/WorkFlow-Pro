namespace :issues do
  desc "update issue positions"
  task reposition: :environment do
    User.all.each do |user|
      user.issues.sort_by_position.each_with_index do |issue, index|
        issue.update_column :position, index + 1
      end
    end
  end
end