namespace :user_company_enablements do
  desc "initialize the user's current company"
  task set_user_role: :environment do
    UserCompanyEnablement.all.each do |uce|
      uce.update!(user_role_id: uce.user.user_role_id)
    end
  end
end