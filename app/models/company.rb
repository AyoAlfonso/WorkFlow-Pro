class Company < ApplicationRecord
  has_many :users
  has_many :annual_initiatives
  has_one :core_four
  accepts_nested_attributes_for :core_four

  def core_four
    super || build_core_four
  end
  def format_fiscal_year_start
    month = sprintf('%02d', fiscal_year_start.month)
    day = sprintf('%02d', fiscal_year_start.day)
    "#{month}/#{day}"
  end
end
