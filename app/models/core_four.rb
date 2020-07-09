class CoreFour < ApplicationRecord
  belongs_to :company
  has_rich_text :core_1
  has_rich_text :core_2
  has_rich_text :core_3
  has_rich_text :core_4
end
