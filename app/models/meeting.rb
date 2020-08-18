class Meeting < ApplicationRecord
  belongs_to :team
  belongs_to :meeting_template

  scope :team_meetings_for_user, -> (user) { where(team_id: user.team_user_enablements.map {|tue| tue.team_id} ) }
  scope :in_progress, -> { where("start_time >= ? AND start_time < ?", Date.today.beginning_of_day.utc, DateTime.now) }

  def self.team_meetings_in_progress_for_user(user)
    self.team_meetings_for_user(user).in_progress
  end
end
