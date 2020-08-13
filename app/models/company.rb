class Company < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper

  before_save :sanitize_rallying_cry

  has_many :users, dependent: :restrict_with_error
  has_many :annual_initiatives, dependent: :restrict_with_error
  has_many :teams, dependent: :restrict_with_error
  has_one_attached :logo
  
  has_one :core_four, dependent: :destroy
  accepts_nested_attributes_for :core_four

  validates :name, :fiscal_year_start, :timezone, presence: true

  def current_fiscal_quarter
    calculate_current_fiscal_quarter
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

  def format_fiscal_year_start
    return "" if fiscal_year_start.blank?
    month = sprintf('%02d', fiscal_year_start.month)
    day = sprintf('%02d', fiscal_year_start.day)
    "#{month}/#{day}"
  end

  def format_month_and_day(date)
    date.strftime("%m/%d")
  end

  private
  def calculate_current_fiscal_quarter
    current_date = format_month_and_day(Date.today)
    if current_date.between?(format_fiscal_year_start, format_month_and_day(second_quarter_start_date()))
      return 1
    elsif current_date.between?(format_month_and_day(second_quarter_start_date()), format_month_and_day(third_quarter_start_date()))
      return 2
    elsif current_date.between?(format_month_and_day(third_quarter_start_date()), format_month_and_day(fourth_quarter_start_date()))
      return 3
    else
      return 4
    end
  end


  def second_quarter_start_date
    # CHRIS' COMMENT: 
    # The reason we do + 13.weeks instead of .next_quarter is because for LynchPyn each quarter
    # is a fixed 13 weeks. Rails does next_quarter by + 3.months (which is not what we want)
    self.fiscal_year_start + 13.weeks
  end

  def third_quarter_start_date
    second_quarter_start_date + 13.weeks
  end

  def fourth_quarter_start_date
    third_quarter_start_date + 13.weeks
  end

  def sanitize_rallying_cry
    self.rallying_cry = strip_tags(rallying_cry)
  end
end
