class TeamIssue < ApplicationRecord
  belongs_to :team
  belongs_to :issue

  has_many :team_issue_meeting_enablements, dependent: :destroy
  has_many :team_meetings, through: :team_issue_meeting_enablements, source: :meeting

  accepts_nested_attributes_for :team_issue_meeting_enablements, allow_destroy: true
  
  acts_as_list scope: [:team_id, :completed_at], add_new_at: :top
  
  scope :for_team, -> (team_id) { where(team_id: team_id) }
  scope :complete, -> { where.not(completed_at: nil) }
  scope :incomplete, -> { where(completed_at: nil) }
  
  scope :sort_by_completed_date, -> { order(completed_at: :desc)}

  scope :owned_by_self_or_team_members, -> (user) do
    team_member_ids = TeamUserEnablement.where(team_id: user.team_ids).pluck(:user_id)
    joins(:issue).where(issues: { user_id: [*team_member_ids, user.id].uniq })
  end
  
  scope :sort_by_position, -> { order(position: :asc) }
  scope :sort_by_issue_priority, -> { joins(:issue).merge(Issue.order(priority: :desc)) }

  def self.exclude_personal_for_team
    self.joins(:issue).where(issues: { personal: false }).or(where(issues: { personal: nil }))
  end

end
