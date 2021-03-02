namespace :companies do
  desc "set onboarding status for existing companies"
  task set_onboarding_status: :environment do
    Company.all.each do |company|
      company.update!(onboarding_status: :complete)
    end
  end
end