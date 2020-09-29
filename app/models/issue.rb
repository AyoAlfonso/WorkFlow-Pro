class Issue < ApplicationRecord
  enum priority: { low: 0, medium: 1, high: 2 }
  belongs_to :user
  belongs_to :team, optional: true
  has_one :team_issue, dependent: :destroy

  acts_as_list scope: :user_id

  scope :created_by_user, -> (user) { where(user: user) }
  scope :sort_by_priority, -> { order(priority: :desc) }
  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :sort_by_completed_date, -> { order(completed_at: :asc)}
  scope :sort_by_position, -> { order(position: :asc) }
  
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
end
