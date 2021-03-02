namespace :companies do
  desc "add sign-up-purpose to existing companies"
  task add_sign_up_purpose: :environment do
    Company.all.each do |company|
      sign_up_purpose = SignUpPurpose.create(company_id: company.id, purpose: "")
      company.update!(sign_up_purpose_id: sign_up_purpose.id)
    end
  end
end