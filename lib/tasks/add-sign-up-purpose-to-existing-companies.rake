namespace :companies do
  desc "add sign-up-purpose to existing companies"
  task add_sign_up_purpose: :environment do
    Company.all.each do |company|
      SignUpPurpose.create!(company_id: company.id, purpose: "")
    end
  end
end