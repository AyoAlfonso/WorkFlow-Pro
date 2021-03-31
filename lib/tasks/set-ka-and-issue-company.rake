namespace :key_activities do
  desc "set company id to the user's key activities"
  task set_company: :environment do
    weekly_scheduled_group = ScheduledGroup.find_by_name("Weekly List")
    backlog_scheduled_group = ScheduledGroup.find_by_name("Backlog")
    KeyActivity.where.not(completed_at: nil).each do |ka|
      ka.update!(company_id: ka.user.company_id || ka.user.companies.first.id, scheduled_group: backlog_scheduled_group)
      ka.move_to_bottom
    end

    KeyActivity.where(completed_at: nil).each do |ka|
      ka.update!(company_id: ka.user.company_id || ka.user.companies.first.id, scheduled_group: weekly_scheduled_group)
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