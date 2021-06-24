class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Allowlist
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, :trackable and :omniauthable
  include ActionView::Helpers::SanitizeHelper
  include HasDefaultAvatarColor
  include HasEmotionScores
  include HasTimezone
  include HasKeyActivityHelpers

  devise :database_authenticatable, :registerable, :confirmable, :invitable,
         :recoverable, :rememberable, :trackable,
         :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self, validate_on_invite: true

  before_save :sanitize_personal_vision
  after_create :create_default_notifications
  delegate :name, :timezone, to: :default_selected_company, prefix: "company", allow_nil: true
  has_many :issues
  has_many :key_activities
  has_many :created_quarterly_goals, :foreign_key => "created_by_id", :class_name => "QuarterlyGoal"
  has_many :owned_quarterly_goals, :foreign_key => "owned_by_id", :class_name => "QuarterlyGoal"
  has_many :created_annual_initiatives, :foreign_key => "created_by_id", :class_name => "AnnualInitiative"
  has_many :owned_annual_initiatives, :foreign_key => "owned_by_id", :class_name => "AnnualInitiative"
  has_many :meeting_ratings
  has_many :daily_logs, dependent: :destroy
  has_one_attached :avatar
  has_many :questionnaire_attempts
  has_many :product_features

  has_many :habits, dependent: :destroy
  has_many :team_user_enablements, dependent: :destroy
  has_many :teams, through: :team_user_enablements
  has_many :notifications, dependent: :destroy
  has_many :meetings, :foreign_key => "hosted_by_id"
  has_many :user_company_enablements, dependent: :destroy
  has_many :companies, through: :user_company_enablements
  has_many :user_pulses, dependent: :destroy
  has_many :journal_entries, dependent: :destroy
  accepts_nested_attributes_for :companies, :allow_destroy => true
  accepts_nested_attributes_for :user_company_enablements, :allow_destroy => true
  accepts_nested_attributes_for :team_user_enablements, :allow_destroy => true
  accepts_nested_attributes_for :product_features, :allow_destroy => true

  validates :first_name, :last_name, presence: true, on: :update
  validates :product_features, length: { maximum: 1, too_long: "1 is maximum" }

  accepts_nested_attributes_for :daily_logs

  #TODO - DELETE COMPANY FROM DATABASE to be removed after we finalize rake, etc.
  belongs_to :default_selected_company, class_name: "Company"

  scope :active_users_for_company, ->(company_id) {
          joins(:user_company_enablements)
            .where(user_company_enablements: { company_id: company_id })
            .where.not(user_company_enablements: { user_role: UserRole::COACH })
        } #later on we can extend inactive users, etc.

  def status
    return "inactive" if deleted_at.present?
    confirmed_at.present? ? "active" : "pending"
  end

  def full_name
    ([first_name, last_name] - [""]).compact.join(" ")
  end

  def avatar_url
    avatar.present? ? Rails.application.routes.url_helpers.rails_blob_url(avatar, host: ENV["ASSETS_HOST_URL"] || ENV["HOST_URL"]) : nil
  end

  def role
    selected_user_company_enablement&.user_role&.name
  end

  def title
    selected_user_company_enablement&.user_title
  end

  def role_for(company)
    self.user_company_enablements.find_by_company_id(company.id)&.user_role&.name
  end

  def title_for(company)
    self.user_company_enablements.find_by_company_id(company.id)&.user_title
  end

  def timezone
    read_attribute(:timezone).present? ? read_attribute(:timezone) : company_timezone
  end

  def weekly_reflection_complete
    QuestionnaireAttempt.of_questionnaire_type("Weekly Reflection").where(completed_at: (self.time_in_user_timezone.beginning_of_week + 1.days)..(self.time_in_user_timezone.end_of_week + 1.days)).present?
  end

  def evening_reflection_complete
    QuestionnaireAttempt.of_questionnaire_type("Evening Reflection").where(completed_at: (self.time_in_user_timezone.beginning_of_day)..(self.time_in_user_timezone.end_of_day)).present?
  end

  def current_daily_log(current_company)
    if self.persisted?
      daily_logs.select(:id, :work_status, :create_my_day, :evening_reflection, :mip_count, :weekly_reflection).where(log_date: self.time_in_user_timezone).first_or_create(mip_count: self.todays_priorities(current_company).count, weekly_reflection: self.weekly_reflection_complete)
    end
  end

  def user_teams_for_company(current_company)
    self.teams.where(company: current_company)
  end

  def user_teams_for_company_or_full_access(current_company)
    self.can_observe_company?(current_company) ? current_company.teams : user_teams_for_company(current_company)
  end

  def team_lead_for?(team)
    team.is_lead?(self)
  end

  def teams_intersect?(teams)
    self.teams.any? { |team| teams.include?(team) }
  end

  def can_observe_company?(company)
    user_company_enablements.find_by_company_id(company.id)&.user_role&.name == UserRole::COACH
  end

  def company_admin?(company)
    company_role = self.user_company_enablements.find_by_company_id(company.id)&.user_role&.name
    company_role == UserRole::CEO || company_role == UserRole::ADMIN
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

  # devise_invitable send_confirmation_notification?
  def send_confirmation_notification?
    false
  end

  # def on_jwt_dispatch(token, payload)
  #   super
  #   #do_something(token, payload)
  # end

  def create_default_notifications
    Notification.notification_types.each do |k, v|
      notification = Notification.find_or_initialize_by(
        user_id: self.id,
        notification_type: v,
      )
      unless notification.persisted?
        notification.attributes = {
          rule: IceCube::DefaultRules.send("default_#{k}_rule"),
          method: :disabled,
        }
        notification.save
      end
    end
  end

  def team_meetings
    Meeting.where(team_id: teams.pluck(:id))
  end

  def time_in_user_timezone(time = nil)
    if time.nil?
      Time.current.in_time_zone(timezone_name)
    elsif time == "noon" #TODO: REFACTOR OUT
      Time.current.in_time_zone(timezone_name).at_noon
    end
  end

  def end_of_day_for_user(date)
    date.to_datetime.in_time_zone(timezone_name).at_end_of_day.change({ hour: 1 })
  end

  def start_of_day_for_user(date)
    date.to_datetime.in_time_zone(timezone_name).at_beginning_of_day.change({ hour: 1 })
  end

  def product_feature(id)
    ProductFeature.where(user_id: id).first
  end

  def questionnaire_type_for_planning
    user_time = self.time_in_user_timezone
    if [2, 3, 4, 5].include? user_time.wday # Tuesday to Friday
      if user_time.wday == 5 && user_time.hour > 12
        "weekly"
      else
        "daily"
      end
    else
      "weekly"
    end
  end

  def user_pulse_for_display(date = nil)
    self.user_pulses.where(completed_at: date || self.time_in_user_timezone.to_date).first
  end

  def daily_average_users_emotion_scores_over_week(from_date, to_date)
    daily_average_users_emotion_score(self, from_date, to_date)
  end

  def daily_average_users_emotion_scores_over_month(from_date, to_date)
    daily_average_users_emotion_score(self, from_date, to_date)
  end

  def team_average_weekly_emotion_score(from_date, to_date)
    overall_average_emotion_score(self, from_date, to_date)
  end

  def team_average_monthly_emotion_score(from_date, to_date)
    overall_average_emotion_score(self, from_date, to_date)
  end

  def habits_percentage_increase_from_previous_week
    differences = self.habits.map do |habit|
      habit.weekly_logs_completion_difference
    end
    (differences.reduce(:+).to_f / differences.size).round(1)
  end

  def habits_percentage_increase_from_previous_month
    differences = self.habits.map do |habit|
      habit.monthly_logs_completion_difference
    end
    (differences.reduce(:+).to_f / differences.size).round(1)
  end

  #https://github.com/heartcombo/devise/wiki/How-to:-Soft-delete-a-user-when-user-deletes-account
  def soft_delete
    update_attribute(:deleted_at, Time.current)
  end

  # ensure user account is active
  def active_for_authentication?
    super && !deleted_at
  end

  # provide a custom message for a deleted account
  def inactive_message
    !deleted_at ? super : :deleted_account
  end

  private

  def sanitize_personal_vision
    self.personal_vision = strip_tags(personal_vision)
  end

  def selected_user_company_enablement
    self.user_company_enablements.find_by_company_id(self.default_selected_company_id)
  end
end
