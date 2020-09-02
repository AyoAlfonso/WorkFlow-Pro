7.times.each do |number|
  sunny = User.find_by_email("sunny@laterolabs.com")
  chris = User.find_by_email("christopher@laterolabs.com")
  kyle = User.find_by_email("kyle@laterolabs.com")
  
  questionnaire = Questionnaire.find_by_name("Evening Reflection")

  QuestionnaireAttempt.create!(questionnaire_id: questionnaire.id, completed_at: Time.now - 2.day - number.day, emotion_score: rand(1..5), user: sunny)
  QuestionnaireAttempt.create!(questionnaire_id: questionnaire.id, completed_at: Time.now - 2.day - number.day, emotion_score: rand(1..5), user: chris)
  QuestionnaireAttempt.create!(questionnaire_id: questionnaire.id, completed_at: Time.now - 2.day - number.day, emotion_score: rand(1..5), user: kyle)
end