namespace :system do
  desc "Group of tasks that is required to migrate data to the new db format"
  task company_migration: :environment do
    Rake::Task["users:set_current_company"].invoke
    Rake::Task["key_activities:set_company"].invoke
    Rake::Task["issues:set_company"].invoke
    Rake::Task["users:company_mapping"].invoke
    Rake::Task["user_company_enablements:set_user_role"].invoke
    Rake::Task["user_company_enablements:set_user_title"].invoke
    Rake::Task["companies:set_onboarding_status"].invoke
  end
end