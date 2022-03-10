class Team < ApplicationRecord
  include HasDefaultAvatarColor
  include HasEmotionScores
  acts_as_paranoid column: :deleted_at
  include ActiveRecordScope
  belongs_to :company
  has_many :team_user_enablements, dependent: :destroy
  has_many :users, through: :team_user_enablements
  has_many :issues
  has_many :meetings, dependent: :destroy
  has_many :team_issues, dependent: :destroy
  has_many :key_activities,  dependent: :destroy
  

  store :settings, accessors: [:weekly_meeting_dashboard_link_embed], coder: JSON

  accepts_nested_attributes_for :team_user_enablements, allow_destroy: true

  scope :for_company, ->(company) { where(company: company) }

  def self.for_user(user)
    self.select { |team| team.users.include?(user) }
  end

  def active
    return !deleted
  end

  def reset_default_team
    if Team.where(company_id: self.company.id, executive: 1).blank?
      existing_available_team = Team.where(company_id: self.company.id, executive: 0).first
      existing_available_team&.set_default_executive_team
    end
  end

  def is_lead?(user)
    team_user_enablements.where(role: :team_lead, user: user).present?
  end

  def set_default_executive_team
    self.update(executive: 1)
  end

  def daily_average_users_emotion_scores_over_week(from_date, to_date)
    daily_average_users_emotion_score(self.users, from_date, to_date)
  end

  def team_average_weekly_emotion_score(from_date, to_date)
    overall_average_emotion_score(self.users, from_date, to_date)
  end

  def daily_average_users_emotion_scores_over_month(from_date, to_date)
    daily_average_users_emotion_score(self.users, from_date, to_date)
  end

  def team_average_monthly_emotion_score(from_date, to_date)
    overall_average_emotion_score(self.users, from_date, to_date)
  end
end
