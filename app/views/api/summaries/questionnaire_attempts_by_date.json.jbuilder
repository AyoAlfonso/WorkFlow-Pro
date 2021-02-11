json.array! @dates do |date|
  json.date date
  json.items @questionnaire_attempts.select { |qa| current_user.convert_to_their_timezone(qa.completed_at).strftime("%a, %b %e") == date } do |questionnaire_attempt|
    json.partial! questionnaire_attempt, partial: 'api/questionnaire_attempts/questionnaire_attempt', as: :questionnaire_attempt
  end
end
