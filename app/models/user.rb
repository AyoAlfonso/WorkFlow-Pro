class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Allowlist
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable, :invitable,
         :recoverable, :rememberable, :trackable,
         :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self, validate_on_invite: true

  belongs_to :company
  delegate :name, :timezone, to: :company, prefix: true, allow_nil: true
  delegate :name, to: :user_role, prefix: true, allow_nil: true
  has_many :issues
  has_many :key_activities
  has_many :personal_reflections
  has_many :created_quarterly_goals, :foreign_key => 'created_by_id', :class_name => 'QuarterlyGoal'
  has_many :owned_quarterly_goals, :foreign_key => 'owned_by_id', :class_name => 'QuarterlyGoal'
  has_many :created_annual_initiatives, :foreign_key => 'created_by_id', :class_name => 'AnnualInitiative'
  has_many :owned_annual_initiatives, :foreign_key => 'owned_by_id', :class_name => 'AnnualInitiative'
  has_many :weekly_meetings, :foreign_key => 'created_by_id', :class_name => 'User'
  has_many :meeting_ratings
  has_many :daily_logs, dependent: :destroy
  has_one_attached :avatar
  belongs_to :user_role

  validates :first_name, :last_name, presence: true

  accepts_nested_attributes_for :daily_logs


  def full_name
    ([first_name, last_name] - ['']).compact.join(' ')
  end

  def avatar_url
    avatar.present? ? Rails.application.routes.url_helpers.rails_blob_url(avatar, host: ENV["ASSETS_HOST_URL"] || ENV["HOST_URL"]) : nil
  end

  def role
    user_role.name
  end

  def get_timezone
    self.timezone.present? ? self.timezone : company_timezone
  end

  def current_daily_log
    daily_logs.select(:id, :work_status).where(log_date: Date.today).first_or_create
  end

  def company_admin?
    role == UserRole::CEO || role == UserRole::ADMIN
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
end
