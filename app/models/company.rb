class Company < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include HasTimezone
  include HasFiscalYear

  before_save :sanitize_rallying_cry

  enum display_format: { Company: 0, Forum: 1 }
  # has_many :users, dependent: :restrict_with_error #thi shas been replaced with default company
  has_many :annual_initiatives, dependent: :restrict_with_error
  has_many :teams, dependent: :restrict_with_error
  has_many :company_static_datas, dependent: :destroy
  has_one_attached :logo, dependent: :destroy
  has_one :sign_up_purpose, dependent: :destroy
  accepts_nested_attributes_for :sign_up_purpose
  
  has_one :core_four, dependent: :destroy
  accepts_nested_attributes_for :core_four

  has_many :user_company_enablements
  has_many :users, through: :user_company_enablements

  accepts_nested_attributes_for :company_static_datas, :allow_destroy => true
  accepts_nested_attributes_for :user_company_enablements, :allow_destroy => true

  validates :name, :timezone, :display_format, presence: true
  validate :display_format_not_changed, on: :update

  enum onboarding_status: { incomplete: 0, complete: 1 }

  scope :with_team, -> (team_id) { joins(:teams).where({teams: {id: team_id}})}

  after_initialize :setup_company_static_data
  after_save :verify_company_static_data

  def setup_company_static_data # we could do additional work to ensure static data is created like building on new record
    company_static_datas.build(field: 'annual_objective', value: 'Annual Objective')
    company_static_datas.build(field: 'quarterly_initiative', value: 'Quarterly Initiative')
    company_static_datas.build(field: 'sub_initiative', value: 'Sub Initiative')
  end

  def verify_company_static_data
    company_static_datas.create(field: 'annual_objective', value: 'Annual Objective') if company_static_datas.where(field: 'annual_objective').blank?
    company_static_datas.create(field: 'quarterly_initiative', value: 'Quarterly Initiative') if company_static_datas.where(field: 'quarterly_initiative').blank?
    company_static_datas.create(field: 'sub_initiative', value: 'Sub Initiative') if company_static_datas.where(field: 'sub_initiative').blank?
  end

  def self.find_first_with_team(team_id)
    with_team(team_id).first
  end

  def core_four
    super || build_core_four
  end

  def logo_url
    logo.present? ? Rails.application.routes.url_helpers.rails_blob_url(logo, host: ENV["ASSETS_HOST_URL"] || ENV["HOST_URL"]) : nil
  end

  def accountability_chart_content
    accountability_chart_embed
  end

  def strategic_plan_content
    strategic_plan_embed
  end

  def date_for_start_on(fiscal_year)
    result = self.current_fiscal_start_date
    if fiscal_year.to_i != self.current_fiscal_year
      result = result + (fiscal_year.to_i - self.current_fiscal_year).year
    end
    result
  end
  
  def forum_intro_video
    StaticData.find_by_field("forum_introduction")
  end

  private

  def sanitize_rallying_cry
    self.rallying_cry = strip_tags(rallying_cry)
  end

  def within_4_weeks_range(end_date)
    self.convert_to_their_timezone + 4.weeks >= end_date
  end

  def display_format_not_changed
    if display_format_changed? && self.persisted?
      errors.add(:display_format, "Update of display_format not allowed.  Please create a new company.")
    end
  end

end
