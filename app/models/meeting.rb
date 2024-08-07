class Meeting < ApplicationRecord
  include StatsHelper
  include QuestionnaireAttemptable

  belongs_to :team, optional: true #a meeting with no team is a personal meeting
  belongs_to :hosted_by, class_name: "User", optional: true
  belongs_to :meeting_template
  store :settings, accessors: [:forum_exploration_topic, :forum_exploration_topic_owner_id, :forum_location], prefix: true, coder: JSON

  has_many :team_issue_meeting_enablements, dependent: :destroy
  has_many :team_issues, through: :team_issue_meeting_enablements

  accepts_nested_attributes_for :team_issue_meeting_enablements, allow_destroy: true

  delegate :steps, :total_duration, :duration, :name, :meeting_type, to: :meeting_template

  scope :optimized, -> { includes([meeting_template: { steps: :image_attachment }]) }

  # scope :in_progress, -> { where("start_time >= ? AND start_time < ?", Date.today.beginning_of_day.utc, DateTime.now) }

  #all personal meetings have start_times that correspond to when they are created!
  #only pre-planned meetings may have start_time = null
  scope :for_day_of_date, ->(start_time) { where("(start_time >= ? AND start_time <= ?) OR start_time IS NULL", start_time.beginning_of_day, start_time.end_of_day) }
  scope :for_week_of_date, ->(start_time) { where("(start_time >= ? AND start_time <= ?) OR start_time IS NULL", start_time.beginning_of_week, start_time.end_of_week) }
  scope :for_month_of_date, ->(start_time) { where("(start_time >= ? AND start_time <= ?) OR start_time IS NULL", start_time.beginning_of_month, start_time.end_of_month) }
  scope :for_week_of_date_started_only, ->(start_time) { where("(start_time >= ? AND start_time <= ?)", start_time.beginning_of_week, start_time.end_of_week) }
  scope :team_meetings, ->(team_id) { where(team_id: team_id) }
  scope :incomplete, -> { where(end_time: nil) }
  scope :with_name, ->(name) { joins(:meeting_template).where(meeting_templates: { name: name }) }
  scope :with_template, ->(meeting_template_id) { where(meeting_template_id: meeting_template_id) }

  scope :hosted_by_user, ->(user) { where(hosted_by_id: user.id) }

  scope :team_weekly_meetings, -> { joins(:meeting_template).where(meeting_templates: { meeting_type: :team_weekly }) }
  scope :personal_meetings, -> { team_meetings(nil) }
  scope :personal_weekly_meetings, -> { joins(:meeting_template).where(meeting_templates: { meeting_type: :personal_weekly }) }
  scope :personal_monthly_meetings, -> { joins(:meeting_template).where(meeting_templates: { meeting_type: :personal_monthly }) }
  scope :forum_monthly_meetings, -> { joins(:meeting_template).where(meeting_templates: { meeting_type: :forum_monthly }) }
  scope :for_type, ->(meeting_type) { joins(:meeting_template).where(meeting_templates: { meeting_type: MeetingTemplate.meeting_types[meeting_type.to_sym] }) }
  scope :for_meeting_template, -> (meeting_template_id) {where(meeting_template_id:meeting_template_id)}
  scope :for_scheduled_start_date_range, ->(start_date_time, end_date_time) { where("meetings.scheduled_start_time >= ? AND meetings.scheduled_start_time <= ?", start_date_time, end_date_time) }

  #TODO: modify scope to fetch completed meetings if recent, sort by 'type', 'incomplete', and 'date created' to show most recent ones
  scope :personal_recent_or_incomplete_for_user, ->(user) { personal_meetings.hosted_by_user(user).incomplete }
  scope :personal_meeting_for_week_on_user, ->(user, for_week_of_date) { personal_meetings.hosted_by_user(user).for_week_of_date(for_week_of_date) }
  scope :from_user_teams, ->(user) { where(team_id: user.teams.ids) }
  scope :hosted_by, ->(user) { where(hosted_by_id: user.id) }

  scope :sort_by_creation_date, -> { order(created_at: :desc) }
  scope :sort_by_start_time, -> { order(start_time: :desc) }
  scope :sort_by_scheduled_start_time_asc, -> { order(scheduled_start_time: :asc) }

  scope :has_notes, -> { where.not(notes: [nil, ""]) }

  before_create :start_meeting_if_weekly_planning

  #TO USE
  #week_to_review_start_time = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
  #Meeting.first_or_create_for_weekly_planning_on_email(current_user, week_to_review_start_time)

  # scope :from_user_teams_or_hosted_by_user, -> (user) {from_user_teams(user).or(hosted_by(user)}
  def self.from_user_teams_or_hosted_by_user(user)
    self.from_user_teams(user).or(self.hosted_by(user))
  end

  def self.first_or_create_for_weekly_planning_on_email(user, week_to_review_start_time)
    self.personal_weekly_meetings.hosted_by_user(user).for_week_of_date(week_to_review_start_time).first_or_create(
      meeting_template_id: MeetingTemplate.personal_weekly.first.id,
      hosted_by_id: user.id,
      host_name: user.full_name,
      current_step: 0,
      #start time automatically set for personal meetings
    )
  end

  def title
    if self.meeting_type == "personal_weekly"
      start_set = start_time || scheduled_start_time
      time_for_title = hosted_by.convert_to_their_timezone(start_set)
      return "" if time_for_title.blank?

      date_for_title = get_next_week_or_current_week_date(time_for_title).to_date.strftime("%B %-d")
      "Planning for Week of #{date_for_title}"
    elsif self.meeting_type == "team_weekly"
      time_for_title = hosted_by.convert_to_their_timezone(start_time)
      time_for_title.strftime("%A, %B %-d")
    elsif (self.meeting_type == "forum_monthly") || (self.meeting_type == "organisation_forum_monthly")
      time_for_title = hosted_by.convert_to_their_timezone(start_time)
      time_for_title.strftime("%A, %B %-d")
    else
      ""
    end
  end

  private

  def start_meeting_if_weekly_planning
    if self.meeting_type == "personal_weekly" || self.meeting_type == "personal_daily"
      self.start_time = Time.now if self.start_time.blank?
    end
  end
end
