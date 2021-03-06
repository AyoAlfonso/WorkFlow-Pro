namespace :key_activities do
  desc "update key activity positions"
  task reposition: :environment do
    #migration should take all todays, weeklys, master and map it to the correct scheduled_group_id in the right order
    raise "This should be removed, repositioning should no longer be off where we needed to reposition all items"
    #assume there is a ScheduledGroup
    User.all.each do |user|
      ScheduledGroup.all.each do |scg|
        KeyActivity.owned_by_user(user).where(scheduled_group_id: scg.id).sort_by_position_priority_and_created_at.each_with_index do |ka, index|
          ka.update_column :position, index + 1
        end
      end
    end
  end
end
