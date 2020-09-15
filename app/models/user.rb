class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Allowlist
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, :trackable and :omniauthable
  include ActionView::Helpers::SanitizeHelper
  include HasDefaultAvatarColor
  include HasEmotionScores

  devise :database_authenticatable, :registerable, :confirmable, :invitable,
         :recoverable, :rememberable, :trackable,
         :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self, validate_on_invite: true

  before_save :sanitize_personal_vision
  after_create :create_default_notifications
  belongs_to :company
  delegate :name, :timezone, to: :company, prefix: true, allow_nil: true
  delegate :name, to: :user_role, prefix: true, allow_nil: true
  has_many :issues
  has_many :key_activities
  has_many :created_quarterly_goals, :foreign_key => 'created_by_id', :class_name => 'QuarterlyGoal'
  has_many :owned_quarterly_goals, :foreign_key => 'owned_by_id', :class_name => 'QuarterlyGoal'
  has_many :created_annual_initiatives, :foreign_key => 'created_by_id', :class_name => 'AnnualInitiative'
  has_many :owned_annual_initiatives, :foreign_key => 'owned_by_id', :class_name => 'AnnualInitiative'
  has_many :weekly_meetings, :foreign_key => 'created_by_id', :class_name => 'User'
  has_many :meeting_ratings
  has_many :daily_logs, dependent: :destroy
  has_one_attached :avatar
  has_many :questionnaire_attempts
  belongs_to :user_role
  has_many :habits
  has_many :team_user_enablements
  has_many :teams, through: :team_user_enablements
  has_many :team_leads
  has_many :notifications, dependent: :destroy

  validates :first_name, :last_name, presence: true

  accepts_nested_attributes_for :daily_logs

  def status
    #todo add inactive
    confirmed_at.present? ? "active" : "pending"
  end

  def full_name
    ([first_name, last_name] - ['']).compact.join(' ')
  end

  def avatar_url
    avatar.present? ? Rails.application.routes.url_helpers.rails_blob_url(avatar, host: ENV["ASSETS_HOST_URL"] || ENV["HOST_URL"]) : nil
  end

  def role
    user_role&.name
  end

  def timezone
    read_attribute(:timezone).present? ? read_attribute(:timezone) : company_timezone
  end

  def current_daily_log
    if self.persisted?
      daily_logs.select(:id, :work_status, :create_my_day, :evening_reflection, :mip_count).where(log_date: Date.today).first_or_create(mip_count: self.todays_priorities.count)
    end
  end

  def team_lead_for?(team)
    team.is_lead?(self)
  end

  def teams_intersect?(teams)
    self.teams.any? { |team| teams.include?(team) }
  end

  def company_admin?
    role == UserRole::CEO || role == UserRole::ADMIN
  end

  def todays_priorities
    self.key_activities.where(todays_priority: true).incomplete.sort_by_priority_and_created_at.limit(3)
  end
  
  # devise confirm! method overriden
  # def confirm!
  #   UserMailer.welcome_message(self).deliver
  #   super
  # end

  # devise_invitable accept_invitation! method overriden
  def accept_invitation!
    self.confirm
    super
  end

  # devise_invitable invite! method overriden
  def invite!(*args)
    super(*args)
    self.confirmed_at = nil
    self.save
  end

  # def on_jwt_dispatch(token, payload)
  #   super
  #   #do_something(token, payload)
  # end

  def create_default_notifications
    Notification.notification_types.each do |k,v|
      notification = Notification.find_or_initialize_by(
        user_id: self.id,
        notification_type: v
      )
      unless notification.persisted?
        notification.attributes = {
          rule: IceCube::DefaultRules.send("default_#{k}_rule"),
          method: :disabled
        }
        notification.save
      end
    end
  end

  def team_meetings
    Meeting.where(team_id: teams.pluck(:id))
  end

  def time_in_user_timezone(time = nil)
    user_timezone = get_timezone_name(self.timezone)
    if time.nil?
      Time.current.in_time_zone(user_timezone)
    elsif time == 'noon'
      Time.current.in_time_zone(user_timezone).at_noon
    end
  end

  def get_timezone_name(timezone)
    # user.timezone looks like "(GMT-08:00) Pacific Time (US & Canada)"
    # we need everything after "(GMT-08:00) "
    timezone[/(?<=\(GMT.\d{2}:\d{2}\)\s).*$/]
  end

  def daily_average_users_emotion_scores_over_week(from_date, to_date)
    daily_average_users_emotion_score(self, from_date, to_date)
  end

  def team_average_weekly_emotion_score(from_date, to_date)
    overall_average_weekly_emotion_score(self, from_date, to_date)
  end

  def habits_percentage_increase_from_previous_week
    differences = self.habits.map do |habit|
      habit.weekly_logs_completion_difference
    end
    (differences.reduce(:+).to_f / differences.size).round(1)
  end


  private
  def sanitize_personal_vision
    self.personal_vision = strip_tags(personal_vision)
  end
end
