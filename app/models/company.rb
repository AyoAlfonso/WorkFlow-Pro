class Company < ApplicationRecord
  has_many :users
  has_many :annual_initiatives
  has_one :core_four
  accepts_nested_attributes_for :core_four
  has_rich_text :accountability_chart
  has_rich_text :strategic_plan

  validates :name, :fiscal_year_start, :timezone, presence: true

  def core_four
    super || build_core_four
  end
  def format_fiscal_year_start
    return "" if fiscal_year_start.blank?
    month = sprintf('%02d', fiscal_year_start.month)
    day = sprintf('%02d', fiscal_year_start.day)
    "#{month}/#{day}"
  end
end
