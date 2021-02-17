class Company < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include HasTimezone
  include HasFiscalYear

  before_save :sanitize_rallying_cry

  enum display_format: { Company: 0, Forum: 1 }
  has_many :users, dependent: :restrict_with_error
  has_many :annual_initiatives, dependent: :restrict_with_error
  has_many :teams, dependent: :restrict_with_error
  has_one_attached :logo
  
  has_one :core_four, dependent: :destroy
  accepts_nested_attributes_for :core_four

  has_many :user_company_enablements
  has_many :users, through: :user_company_enablements

  accepts_nested_attributes_for :user_company_enablements, :allow_destroy => true

  validates :name, :timezone, :display_format, presence: true
  validate :display_format_not_changed, on: :update

  scope :with_team, -> (team_id) { joins(:teams).where({teams: {id: team_id}})}
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
      result = result + year_difference.year
    end
    result
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
