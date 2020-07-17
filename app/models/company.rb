class Company < ApplicationRecord
  has_many :users
  has_many :annual_initiatives
  has_one_attached :logo
  
  has_one :core_four
  accepts_nested_attributes_for :core_four
  has_rich_text :accountability_chart
  has_rich_text :strategic_plan
  
  include RichTextHelper
  rich_text_content_render :accountability_chart, :strategic_plan

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

end
