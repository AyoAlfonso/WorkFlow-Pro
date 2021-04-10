json.extract! user, :id, :first_name, :last_name, :email, :role, :avatar_url, :confirmed_at, :invitation_sent_at, :timezone, :phone_number, :default_avatar_color, :title, :status, :default_selected_company_id
json.user_pulse_for_display user.user_pulse_for_display
json.current_company_onboarded current_company.complete?
 
json.company_profiles user.companies.where(onboarding_status: 1) do |company|
  json.extract! company, :id, :name, :display_format
end