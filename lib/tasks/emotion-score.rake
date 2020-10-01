namespace :questionnaire_attempts do
  desc "update emotion scores"
  task emotion_score: :environment do
    QuestionnaireAttempt.joins(:questionnaire).where(questionnaires: { name: "Evening Reflection" }).each do |qa|
      if qa.rendered_steps.present?
        qa.emotion_score = qa.rendered_steps.detect { |rs| rs["id"] == "rating" }["value"]
        qa.save!
      end
    end
  end
end