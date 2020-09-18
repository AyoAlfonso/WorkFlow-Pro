namespace :key_activities do
  desc "update key activity positions"
  task reposition: :environment do
    User.all.each do |user|
      KeyActivity.owned_by_user(user).sort_by_todays_priority_weekly_list_position.each_with_index do |ka, index|
        ka.position = index + 1
        ka.save!
      end
    end
  end
end