namespace :users do
  desc "map user company ids to user company enablements"
  task company_mapping: :environment do
    User.all.each do |user|
      user.user_company_enablements.first_or_create!(user: user, company_id: user.company_id, user_role_id: user.read_attribute(:user_role_id), user_title: user.read_attribute(:title))
    end
  end
end