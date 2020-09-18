namespace :key_activities do
  desc "update key activity positions"
  task reposition: :environment do
    KeyActivity.where.not(completed_at: nil).each do |ka|
      ka.weekly_list = false
      ka.todays_priority = false
      ka.save!
    end

    User.all.each do |user|
      KeyActivity.owned_by_user(user).todays_priority.sort_by_position_priority_and_created_at.each_with_index do |ka, index|
        ka.update_column :position, index + 1
      end
      KeyActivity.owned_by_user(user).weekly_list.sort_by_position_priority_and_created_at.each_with_index do |ka, index|
        ka.update_column :position, index + 1
      end
      KeyActivity.owned_by_user(user).master_list.sort_by_position_priority_and_created_at.each_with_index do |ka, index|
        ka.update_column :position, index + 1
      end
    end
  end
end