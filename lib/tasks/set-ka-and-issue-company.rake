namespace :key_activities do
  desc "set company id to the user's key activities"
  task set_company: :environment do
    KeyActivity.all.each do |ka|
      ka.update!(company_id: ka.user.company_id || ka.user.companies.first.id)
    end
  end
end

namespace :issues do
  desc "initialize the user's current company"
  task set_company: :environment do
    Issue.all.each do |issue|
      issue.update!(company_id: issue.user.company_id || issue.user.companies.first.id)
    end
  end
end