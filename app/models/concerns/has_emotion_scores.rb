module HasEmotionScores
  extend ActiveSupport::Concern
  include StatsHelper
  
  def daily_average_users_emotion_score(users, from_date, to_date)
    user_pulses = UserPulse.where(user: users)
                            .where("completed_at <= ? AND completed_at >= ?", to_date, from_date)
                            .order(:completed_at)
                            .group_by{|qa| qa.completed_at.strftime("%a-%-d")}

    results_array = []

    user_pulses.map do |qa|
      average_score_hash = {
        date: qa[0],
        average_score: qa[1].pluck(:score).inject(:+).to_f / qa[1].size
      }
      results_array << average_score_hash
    end

    record_dates = results_array.pluck(:date).map do |date|
      date
    end
    
    {
      emotion_scores: results_array,
      record_dates: record_dates
    }
  end

  def overall_average_emotion_score(users, from_date, to_date)
    average_user_score = daily_average_users_emotion_score(users, from_date, to_date)[:emotion_scores]
    if average_user_score.size == 0
      0
    else
      sum_of_scores = average_user_score.pluck(:average_score).sum
      sum_of_scores / average_user_score.size
    end
  end

  def compare_emotion_score(current_value, previous_value)
    difference_between_values(current_value, previous_value)
  end
  
end