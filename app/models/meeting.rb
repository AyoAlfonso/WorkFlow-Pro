class Meeting < ApplicationRecord
  belongs_to :team, optional: true #a meeting with no team is a personal meeting
  belongs_to :hosted_by, class_name: "User", optional: true
  belongs_to :meeting_template

  delegate :steps, :total_duration, :duration, :name, :meeting_type, to: :meeting_template

  # scope :in_progress, -> { where("start_time >= ? AND start_time < ?", Date.today.beginning_of_day.utc, DateTime.now) }
  # scope :for_day, -> (day) { where("Date(created_at) = ?", day) }
  scope :for_week_of_date, -> (start_time) { where("start_time >= ? AND start_time <= ?", start_time.beginning_of_week, start_time.end_of_week)}
  scope :team_meetings, -> (team_id) { where(team_id: team_id) }
  scope :sort_by_creation_date, -> { order(created_at: :desc)}
  scope :incomplete, -> { where(end_time: nil) }
  scope :with_name, -> (name) { joins(:meeting_template).where(meeting_templates: { name: name}) }
  scope :with_template, -> (meeting_template_id) { where(meeting_template_id: meeting_template_id) }
  
  scope :hosted_by_user, -> (user) { where(hosted_by_id: user.id)}
  scope :personal_meetings, -> { joins(:meeting_template).where(meeting_templates: {meeting_type: :personal_weekly})}
  
  #TODO: modify scope to fetch completed meetings if recent, sort by 'type', 'incomplete', and 'date created' to show most recent ones
  scope :personal_recent_or_incomplete_for_user, ->(user) { personal_meetings.hosted_by_user(user).incomplete}
  
  
  scope :personal_meeting_for_week_on_user, -> (user, for_week_of_date) { personal_meetings.hosted_by_user(user).for_week_of_date(for_week_of_date) }

  before_create :start_meeting_if_weekly_planning

  #TO USE
  #week_to_review_start_time = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
  #Meeting.first_or_create_for_weekly_planning_on_email(current_user, week_to_review_start_time)

  def self.first_or_create_for_weekly_planning_on_email(user, week_to_review_start_time)
    self.personal_meetings.hosted_by_user(user).for_week_of_date(week_to_review_start_time).first_or_create(
      meeting_template_id: MeetingTemplate.personal_weekly.first.id,
      hosted_by_id: user.id,
      host_name: user.full_name
      #start time automatically set for personal meetings
    )
  end

  private
  def start_meeting_if_weekly_planning
    if self.meeting_type == "personal_weekly"
      self.start_time = Time.now
    end
  end
end
