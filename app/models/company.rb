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
    calculate_current_fiscal_quarter(self.fiscal_year_start)
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

  private
  def calculate_current_fiscal_quarter(fiscal_year_start)
    current_date = Date.today
    next_fiscal_year_start = fiscal_year_start + 1.year
    if current_date > next_fiscal_year_start
      return calculate_current_fiscal_quarter(next_fiscal_year_start)
    elsif current_date.between?(first_quarter_start_date(fiscal_year_start), second_quarter_start_date(fiscal_year_start))
      return 1
    elsif current_date.between?(second_quarter_start_date(fiscal_year_start), third_quarter_start_date(fiscal_year_start))
      return 2
    elsif current_date.between?(third_quarter_start_date(fiscal_year_start), fourth_quarter_start_date(fiscal_year_start))
      return 3
    else
      return 4
    end
  end

  def first_quarter_start_date(date)
    date.beginning_of_quarter
  end

  def second_quarter_start_date(date)
    # CHRIS' COMMENT: 
    # The reason we do + 13.weeks instead of .next_quarter is because for LynchPyn each quarter
    # is a fixed 13 weeks. Rails does next_quarter by + 3.months (which is not what we want)
    date + 13.weeks
  end

  def third_quarter_start_date(date)
    second_quarter_start_date(date) + 13.weeks
  end

  def fourth_quarter_start_date(date)
    third_quarter_start_date(date) + 13.weeks
  end
end
