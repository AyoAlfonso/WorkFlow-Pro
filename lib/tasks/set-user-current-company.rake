namespace :users do
  desc "initialize the user's current company"
  task set_current_company: :environment do
    User.all.each do |user|
      user.update!(current_selected_company_id: user.companies.first.id)
    end
  end
end