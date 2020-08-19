class Meeting < ApplicationRecord
  belongs_to :team
  belongs_to :meeting_template

  scope :in_progress, -> { where("start_time >= ? AND start_time < ?", Date.today.beginning_of_day.utc, DateTime.now) }
  scope :team_meetings, -> (team_id) { where(team_id: team_id) }
end
