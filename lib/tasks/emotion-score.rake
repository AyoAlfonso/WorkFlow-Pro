namespace :questionnaire_attempts do
  desc "update emotion scores"
  task emotion_score: :environment do
    QuestionnaireAttempt.joins(:questionnaire).where(questionnaires: { name: "Evening Reflection" }).each do |qa|
      if qa.rendered_steps.present?
        rating_value = case qa.rendered_steps.detect { |rs| rs["id"] == "rating" }["value"]
        qa.emotion_score = case rating_value
          when "Emotion-A"
            1
          when "Emotion-B"
            2
          when "Emotion-C"
            3
          when "Emotion-D"
            4
          when "Emotion-E"
            5
          else
            rating_value
        end
        qa.save!
      end
      end
    end
  end
end