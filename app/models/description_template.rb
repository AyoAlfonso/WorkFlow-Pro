class DescriptionTemplate < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include RichTextHelper
  belongs_to :company
  has_rich_text :body
  rich_text_content_render :body

  enum template_type: DefaultAdminTemplate.template_types

  scope :sort_by_title, ->(title) { where(title: title) }
  scope :is_of_type, ->(type) { where(template_type: type) }
  scope :owned_by_company, ->(company) { where(company_id: company) }

  def body_content
    body.body
  end

  def template_types
    DescriptionTemplate.template_types
  end
end
