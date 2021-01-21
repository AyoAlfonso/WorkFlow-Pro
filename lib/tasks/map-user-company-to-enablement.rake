namespace :users do
  desc "map user company ids to user company enablements"
  task company_mapping: :environment do
    User.all.each do |user|
      UserCompanyEnablement.first_or_create!(user: user, company_id: user.company_id)
    end
  end
end