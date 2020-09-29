class Team < ApplicationRecord
  include HasDefaultAvatarColor
  include HasEmotionScores
  belongs_to :company
  has_many :team_user_enablements
  has_many :users, through: :team_user_enablements
  has_many :issues
  has_many :meetings
  has_many :team_issues, dependent: :destroy

  store :settings, accessors: [:weekly_meeting_dashboard_link_embed], coder: JSON

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

  def daily_average_users_emotion_scores_over_week(from_date, to_date)
    daily_average_users_emotion_score(self.users, from_date, to_date)
  end

  def team_average_weekly_emotion_score(from_date, to_date)
    overall_average_weekly_emotion_score(self.users, from_date, to_date)
  end


end
