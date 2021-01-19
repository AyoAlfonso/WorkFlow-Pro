namespace :key_activities do
  desc "set company id to the user's key activities"
  task set_company: :environment do
    KeyActivity.all.each do |ka|
      ka.update!(company: ka.user.companies.first)
    end
  end
end

namespace :issues do
  desc "initialize the user's current company"
  task set_company: :environment do
    Issue.all.each do |issue|
      issue.update!(company: issue.user.companies.first)
    end
  end
end