class Company < ApplicationRecord
  has_many :users
  has_many :annual_initiatives
  has_many :teams
  has_one_attached :logo
  
  has_one :core_four, dependent: :destroy
  accepts_nested_attributes_for :core_four
  has_rich_text :accountability_chart
  has_rich_text :strategic_plan
  
  include RichTextHelper
  rich_text_content_render :accountability_chart, :strategic_plan

  validates :name, :fiscal_year_start, :timezone, presence: true

  def current_fiscal_quarter
    calculate_current_fiscal_quarter
  end

  def core_four
    super || build_core_four
  end

  def format_fiscal_year_start
    return "" if fiscal_year_start.blank?
    month = sprintf('%02d', fiscal_year_start.month)
    day = sprintf('%02d', fiscal_year_start.day)
    "#{month}/#{day}"
  end

  def logo_url
    logo.present? ? Rails.application.routes.url_helpers.rails_blob_url(logo, host: ENV["ASSETS_HOST_URL"] || ENV["HOST_URL"]) : nil
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
end
