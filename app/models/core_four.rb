class CoreFour < ApplicationRecord
  belongs_to :company
  has_rich_text :core_1
  has_rich_text :core_2
  has_rich_text :core_3
  has_rich_text :core_4

  include RichTextHelper
  rich_text_content_render :core_1, :core_2, :core_3, :core_4
end
