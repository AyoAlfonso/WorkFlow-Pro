class Issue < ApplicationRecord
  enum priority: { low: 0, medium: 1, high: 2, frog: 3 }
  belongs_to :user
  belongs_to :team, optional: true
  belongs_to :company

  has_one :team_issue, dependent: :destroy, autosave: true
  accepts_nested_attributes_for :team_issue

  has_many :team_issue_meeting_enablements, through: :team_issue

  before_save :create_or_update_team_issue

  acts_as_list scope: [:company_id, :user_id, :completed_at]

  scope :optimized, -> { includes([:user]) }
  scope :user_current_company, -> (company_id) {where(company_id: company_id)}

  scope :created_by_user, -> (user) { where(user: user) }
  scope :sort_by_priority, -> { order(priority: :desc) }
  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :sort_by_completed_date, -> { order(completed_at: :asc)}
  scope :sort_by_position, -> { order(position: :asc) }
  scope :complete, -> { where.not(completed_at: nil) }
  scope :incomplete, -> { where(completed_at: nil) }
  
  scope :created_between, -> (date_start, date_end) { where("created_at >= ? AND created_at < ?", date_start, date_end) }
  scope :user_created_between, -> (user, date_start, date_end) { created_by_user(user).created_between(date_start, date_end) }

  validates :description, presence: true
  
  def self.sort_by_position_and_priority_and_created_at_and_completed_at
    self.sort_by_position.sort_by_priority.sort_by_created_date.sort_by_completed_date
  end

  def self.owned_by_self_or_team_members(user)
    team_member_ids = TeamUserEnablement.where(team_id: user.team_ids).pluck(:user_id)
    self.where(user_id: [*team_member_ids, user.id].uniq)
  end

  def create_or_update_team_issue
    if self.team_id
      team_issue_to_update = team_issue || build_team_issue
      team_issue_to_update.team_id = self.team_id
      team_issue_to_update.completed_at = self.completed_at
    # there is no else case because you cannot unshare an issue from the team, but you can switch which team it's associated with
    end
  end
end
