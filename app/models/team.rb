class Team < ApplicationRecord
  include HasDefaultAvatarColor
  belongs_to :company
  has_many :team_user_enablements
  has_many :users, through: :team_user_enablements
  has_many :issues
  has_many :meetings

  accepts_nested_attributes_for :team_user_enablements, allow_destroy: true

  scope :for_company, -> (company) { where(company: company) }
  
  def self.for_user(user)
    self.select { |team| team.users.include?(user) }
  end

  def is_lead?(user)
    team_user_enablements.where(role: :team_lead, user: user).present?
  end

  def active
    #eventually add deactivation rules and items
    true
  end

  def weekly_average_users_emotion_score
    q_attempts = QuestionnaireAttempt.where(user: self.users)
                                      .where("emotion_score IS NOT NULL AND completed_at <= ? AND completed_at >= ?", 1.day.ago, 1.week.ago)
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
    results_array
  end

end
