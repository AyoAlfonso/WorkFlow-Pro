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

  validates :name, :timezone, :display_format, presence: true
  validate :display_format_not_changed, on: :update

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
