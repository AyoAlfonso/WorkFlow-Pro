class KeyActivity < ApplicationRecord
  include HasOrderByRelatedId

  enum priority: { low: 0, medium: 1, high: 2, frog: 3 }
  belongs_to :user
  belongs_to :meeting, optional: true
  belongs_to :company
  belongs_to :scheduled_group, optional: true
  belongs_to :team, optional: true

  acts_as_list scope: [:company_id, :user_id, :team_id, :scheduled_group_id]

  acts_as_taggable_on :labels

  scope :optimized, -> { includes([:user]) }
  scope :user_current_company, -> (company_id) {where(company_id: company_id)}

  scope :created_by_user, -> (user) { where(user: user) }
  scope :sort_by_priority, -> { order(priority: :desc) }
  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :owned_by_user, -> (user) { where(user: user) }
  scope :sort_by_position, -> { order(:position) }
  scope :created_in_meeting, -> (meeting_id) { where(meeting_id: meeting_id) }

  scope :is_in_scheduled_group_id, -> (scheduled_group_id) { where(scheduled_group_id: scheduled_group_id)}

  scope :incomplete, -> { where(completed_at: nil) }
  scope :has_due_date, -> { where.not(due_date: nil) }
  
  scope :created_between, -> (date_start, date_end) { where("created_at >= ? AND created_at < ?", date_start, date_end) }
  scope :user_created_between, -> (user, date_start, date_end) { created_by_user(user).created_between(date_start, date_end) }
  scope :completed_between, -> (date_start, date_end) { where("completed_at >= ? AND completed_at <= ?", date_start, date_end) }
  scope :user_completed_between, -> (user, date_start, date_end) { owned_by_user(user).completed_between(date_start, date_end) }
  scope :completed_today, -> (user) { where("completed_at BETWEEN '#{user.time_in_user_timezone.beginning_of_day}' AND '#{user.time_in_user_timezone.end_of_day}'") }

  scope :sort_by_priority_and_created_at, -> {sort_by_priority.sort_by_created_date}
  scope :sort_by_position_priority_and_created_at, -> { sort_by_position.sort_by_priority.sort_by_created_date }
  scope :sort_by_progressing_non_backlog_position, -> { order_by_related_ids('scheduled_group_id', [
    ScheduledGroup.find_by_name("Today").id, 
    ScheduledGroup.find_by_name("Tomorrow").id,
    ScheduledGroup.find_by_name("Weekly List").id,
    ScheduledGroup.find_by_name("Backlog").id
    ]).sort_by_position}
  scope :sort_by_due_date, -> { order(due_date: :asc) }

  validates :description, presence: true

  def self.filter_by_team_meeting(meeting_template_id, team_id)
    meeting_ids = Meeting.where(meeting_template_id: meeting_template_id, team_id: team_id).pluck(:id)
    self.where(meeting_id: meeting_ids)
  end

  def self.owned_by_self_or_team_members(user)
    team_member_ids = TeamUserEnablement.where(team_id: user.team_ids).pluck(:user_id)
    self.where(user_id: [*team_member_ids, user.id])
  end

  def self.exclude_personal_for_team(team_id)
    tag_names = ActsAsTaggableOn::Tag.where(team_id: nil).pluck(:name)
    self.tagged_with(tag_names, :exclude => true)
  end
end
