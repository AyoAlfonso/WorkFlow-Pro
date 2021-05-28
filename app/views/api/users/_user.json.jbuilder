json.extract! user, :id, :first_name, :last_name, :email, :avatar_url, :confirmed_at, :invitation_sent_at, :timezone, :phone_number, :default_avatar_color, :status, :default_selected_company_id
json.role role if defined?(role)
json.title title if defined?(title)
json.user_pulse_for_display user.user_pulse_for_display
json.current_company_onboarded current_company.complete?
json.questionnaire_type_for_planning user.questionnaire_type_for_planning
 
json.company_profiles user.companies.where(onboarding_status: 1) do |company|
  json.extract! company, :id, :name, :display_format
end