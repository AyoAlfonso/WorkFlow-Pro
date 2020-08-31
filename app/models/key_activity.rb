class KeyActivity < ApplicationRecord
  enum priority: { low: 0, medium: 1, high: 2, frog: 3 }
  belongs_to :user
  belongs_to :meeting, optional: true
  acts_as_list scope: [:user_id, :weekly_list]
  acts_as_list scope: [:user_id, :todays_priority]

  scope :created_by_user, -> (user) { where(user: user) }
  scope :sort_by_priority, -> { order(priority: :desc) }
  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :owned_by_user, -> (user) { where(user: user) }
  scope :sort_by_position, -> { order(:position) }
  scope :created_in_meeting, -> (meeting_id) { where(meeting_id: meeting_id) }
  scope :weekly_list, -> { where(weekly_list: true) }
  scope :todays_priority, -> { where(todays_priority: true) }
  
  scope :created_between, -> (date_start, date_end) { where("created_at < ? AND created_at >= ?", date_start, date_end) }
  scope :user_created_between, -> (user, date_start, date_end) { created_by_user(user).created_between(date_start, date_end) }
  scope :completed_between, -> (date_start, date_end) { where("completed_at < ? AND completed_at >= ?", date_start, date_end) }
  scope :user_completed_between, -> (user, date_start, date_end) { owned_by_user(user).completed_between(date_start, date_end) }

  scope :sort_by_position_priority_and_created_at, -> { sort_by_position.sort_by_priority.sort_by_created_date }
  scope :sort_by_priority_and_created_at, -> {sort_by_priority.sort_by_created_date}

  validates :description, presence: true

  def self.filter_by_team_meeting(meeting_template_id, team_id)
    meeting_ids = Meeting.where(meeting_template_id: meeting_template_id, team_id: team_id).pluck(:id)
    self.where(meeting_id: meeting_ids)
  end
end
