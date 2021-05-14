namespace :users do
  desc 'create default notifications for all users'
  task create_default_notifications: :environment do
    User.all.each do |user|
      user.create_default_notifications
    end
  end
end
