class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Allowlist
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, #:confirmable,
         :recoverable, :rememberable, :trackable,
         :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  belongs_to :company
  delegate :name, :timezone, to: :company, prefix: true, allow_nil: true
  has_many :issues
  has_many :key_activities
  has_many :personal_reflections
  has_many :created_quarterly_goals, :foreign_key => 'created_by_id', :class_name => 'QuarterlyGoal'
  has_many :owned_quarterly_goals, :foreign_key => 'owned_by_id', :class_name => 'QuarterlyGoal'
  has_many :created_annual_initiatives, :foreign_key => 'created_by_id', :class_name => 'AnnualInitiative'
  has_many :owned_annual_initiatives, :foreign_key => 'owned_by_id', :class_name => 'AnnualInitiative'
  has_many :weekly_meetings, :foreign_key => 'created_by_id', :class_name => 'User'
  has_many :meeting_ratings
  has_one_attached :avatar

  def full_name
    ([first_name, last_name] - ['']).compact.join(' ')
  end

  def avatar_url
    self.avatar.try(:url) || "#{ENV['HOST_URL']}/assets/avatar-blank.png"
  end

  def get_timezone
    self.timezone.present? ? self.timezone : company_timezone
  end

  # def on_jwt_dispatch(token, payload)
  #   super
  #   #do_something(token, payload)
  # end
end
