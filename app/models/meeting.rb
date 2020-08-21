class Meeting < ApplicationRecord
  belongs_to :team
  belongs_to :meeting_template

  delegate :steps, to: :meeting_template
  delegate :duration, to: :meeting_template
  delegate :name, to: :meeting_template
  delegate :meeting_type, to: :meeting_template

  scope :in_progress, -> { where("start_time >= ? AND start_time < ?", Date.today.beginning_of_day.utc, DateTime.now) }
  scope :team_meetings, -> (team_id) { where(team_id: team_id) }
  scope :sort_by_creation_date, -> { order(created_at: :desc)}
end
