class KeyActivity < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include HasOrderByRelatedId
  amoeba do
    enable
    include_association :taggings
  end

  enum priority: { low: 0, medium: 1, high: 2, frog: 3 }
  belongs_to :user
  belongs_to :meeting, optional: true
  belongs_to :company
  belongs_to :scheduled_group, optional: true
  belongs_to :team, optional: true
  has_many :comment_logs, as: :parent, dependent: :destroy

  before_save :sanitize_body
  
  acts_as_list scope: [:company_id, :user_id, :team_id, :scheduled_group_id]

  acts_as_taggable_on :labels

  scope :optimized, -> { includes([:user, :labels, :label_taggings, :comment_logs]) }
  scope :optimized_for_team, -> { includes([:taggings]) }
  scope :user_current_company, ->(company_id) { where(company_id: company_id) }

  scope :created_by_user, ->(user) { where(user: user) }
  scope :sort_by_priority, -> { order(priority: :desc) }
  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :owned_by_user, ->(user) { where(user: user) }
  scope :sort_by_position, -> { order(:position) }
  scope :created_in_meeting, ->(meeting_id) { where(meeting_id: meeting_id) }

  scope :is_in_scheduled_group_id, ->(scheduled_group_id) { where(scheduled_group_id: scheduled_group_id) }

  scope :incomplete, -> { where(completed_at: nil) }
  scope :has_due_date, -> { where.not(due_date: nil) }

  scope :created_between, ->(date_start, date_end) { where("created_at >= ? AND created_at < ?", date_start, date_end) }
  scope :user_created_between, ->(user, date_start, date_end) { created_by_user(user).created_between(date_start, date_end) }
  scope :completed_between, ->(date_start, date_end) { where("completed_at BETWEEN ? AND ?", date_start, date_end) }
  scope :user_completed_between, ->(user, date_start, date_end) { owned_by_user(user).completed_between(date_start, date_end) }

  scope :completed_yesterday_for_user, ->(user) { completed_between(user.time_in_user_timezone.beginning_of_day - 1.day, user.time_in_user_timezone.end_of_day - 1.day) }
  scope :completed_today_for_user, ->(user) { completed_between(user.time_in_user_timezone.beginning_of_day, user.time_in_user_timezone.end_of_day) }

  scope :sort_by_priority_and_created_at, -> { sort_by_priority.sort_by_created_date }
  scope :sort_by_position_priority_and_created_at, -> { sort_by_position.sort_by_priority.sort_by_created_date }
  scope :sort_by_progressing_non_backlog_position, -> { order('scheduled_group_id::integer ASC')}
  scope :sort_by_due_date, -> { order(due_date: :asc) }
  scope :completed_state_and_owned_by_current_user, ->(completed, user) { (completed ? where.not(completed_at: nil) : where(completed_at: nil)).owned_by_user(user) }

  scope :exclude_personal_for_team, -> { where.not(personal: true) }

  validates :description, presence: true
  validate :has_required_grouping, on: :create

  before_update :set_move_today_on

  def set_move_today_on
    if scheduled_group_id_changed? && scheduled_group_id == ScheduledGroup.find_by_name("Today").id && self.moved_to_today_on.blank?
      self.moved_to_today_on = self.user.time_in_user_timezone.to_date
    elsif scheduled_group_id_changed? && scheduled_group_id_was == ScheduledGroup.find_by_name("Today").id && completed_at.blank?
      self.moved_to_today_on = nil
    elsif completed_at_changed? && completed_at_was.present?
      #remove the completion, bring it back, brings the item back to backlog
      self.moved_to_today_on = nil
    else
      #do nothing
    end
  end

  def self.filter_by_team_meeting(meeting_template_id, team_id)

    meeting_ids = Meeting.where(meeting_template_id: meeting_template_id, team_id: team_id).pluck(:id)
    self.where(meeting_id: meeting_ids)
  end

  def self.owned_by_self_or_team_members(user)
    team_member_ids = TeamUserEnablement.where(team_id: user.team_ids).pluck(:user_id)
    self.where(user_id: [*team_member_ids, user.id])
  end

  def has_required_grouping
    if scheduled_group_id.blank? && team_id.blank?
      errors.add(:base, "A valid list option for the Pyn must must be selected")
    end
  end
  private
  
  def sanitize_body
    self.body = strip_tags(body)
  end

end
