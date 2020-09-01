module HasEmotionScores
  extend ActiveSupport::Concern
  
  def daily_average_users_emotion_score(users, from_date, to_date)
    q_attempts = QuestionnaireAttempt.where(user: users)
                                      .where("emotion_score IS NOT NULL AND completed_at <= ? AND completed_at >= ?", to_date, from_date)
                                      .select(:id, :completed_at, :emotion_score)
                                      .group_by{|qa| qa.completed_at}
    results_array = []
    q_attempts.map do |qa|
      average_score_hash = {
        date: qa[0].to_date,
        average_score: qa[1].pluck(:emotion_score).inject(:+).to_f / qa[1].size
      }
      results_array << average_score_hash
    end
    results_array.reverse!
  end

  def overall_average_weekly_emotion_score(users, from_date, to_date)
    average_user_score = daily_average_users_emotion_score(users, from_date, to_date)
    if average_user_score.size == 0
      0
    else
      sum_of_scores = average_user_score.pluck(:average_score).sum
      sum_of_scores / average_user_score.size
    end
  end

  def compare_weekly_emotion_score(current, previous)
    if current >= previous
      difference = previous == 0 ? 
                    current * 100 : 
                    ((current - previous).to_f / previous.to_f) * 100
    else
      difference = current == 0 ? 
                    previous * 100 : 
                    ((previous - current).to_f / current.to_f) * 100
    end
  end
  
end