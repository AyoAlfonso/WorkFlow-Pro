class KeyElement < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper

  before_save :sanitize_value

  belongs_to :elementable, :polymorphic => true

  default_scope { order(id: :asc) }

  private
  def sanitize_value
    self.value = strip_tags(value)
  end

end
