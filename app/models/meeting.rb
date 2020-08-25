class Meeting < ApplicationRecord
  belongs_to :team
  belongs_to :meeting_template

  delegate :steps, to: :meeting_template
  delegate :duration, to: :meeting_template
  delegate :name, to: :meeting_template
  delegate :meeting_type, to: :meeting_template

  scope :in_progress, -> { where("start_time >= ? AND start_time < ?", Date.today.beginning_of_day.utc, DateTime.now) }
  scope :for_day, -> (day) { where("Date(created_at) = ?", day) }
  scope :team_meetings, -> (team_id) { where(team_id: team_id) }
  scope :sort_by_creation_date, -> { order(created_at: :desc)}
  scope :incomplete, -> { where(end_time: nil) }
  scope :with_name, -> (name) { joins(:meeting_template).merge(MeetingTemplate.with_name(name)) }
  scope :with_template, -> (meeting_template_id) { where(meeting_template_id: meeting_template_id) }
end
