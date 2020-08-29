class Meeting < ApplicationRecord
  belongs_to :team, optional: true #a meeting with no team is a personal meeting
  belongs_to :hosted_by, class_name: "User", optional: true
  belongs_to :meeting_template

  has_many :key_activities

  delegate :steps, to: :meeting_template
  delegate :total_duration, :duration, to: :meeting_template
  delegate :name, to: :meeting_template
  delegate :meeting_type, to: :meeting_template

  scope :in_progress, -> { where("start_time >= ? AND start_time < ?", Date.today.beginning_of_day.utc, DateTime.now) }
  scope :for_day, -> (day) { where("Date(created_at) = ?", day) }
  scope :team_meetings, -> (team_id) { where(team_id: team_id) }
  scope :sort_by_creation_date, -> { order(created_at: :desc)}
  scope :incomplete, -> { where(end_time: nil) }
  scope :with_name, -> (name) { joins(:meeting_template).where(meeting_templates: { name: name}) }
  scope :with_template, -> (meeting_template_id) { where(meeting_template_id: meeting_template_id) }
  
  scope :hosted_by_user, -> (user) { where(hosted_by_id: user.id)}
  scope :personal_meetings, -> { joins(:meeting_template).where(meeting_templates: {meeting_type: :personal_weekly})}
  #TODO: modify scope to fetch completed meetings if recent, sort by 'type', 'incomplete', and 'date created' to show most recent ones
  scope :personal_recent_or_incomplete_for_user, ->(user) { personal_meetings.hosted_by_user(user).incomplete}
  
  
  #TODO: ADD FIELD TO LAYER IN MODIFIED MEETING DURATIONS FOR THE AGENDA
end
