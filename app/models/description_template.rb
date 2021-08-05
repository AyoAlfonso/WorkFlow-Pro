class DescriptionTemplate < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper

  before_save :sanitize_body
  enum template_type: {
    kpi: 0,
    objectives: 1,
    initiatives: 2,
  }
  
  scope :sort_by_title,    ->(title) { where(title: title) }
  scope :is_of_type, ->(type) { where(template_type: type) }
  scope :owned_by_company, ->(company) { where(company_id: company) }

  private

  def sanitize_body
    self.body = strip_tags(body)
  end
end
