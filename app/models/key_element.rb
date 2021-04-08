class KeyElement < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper

  before_save :sanitize_value

  belongs_to :elementable, :polymorphic => true
  
  # completion_type of binary is boolean, if completed_at.present?
  # completion_type of currency is in cents (data type integer)
  enum completion_type: { binary: 0, numerical: 1, percentage: 2, currency: 3 }

  default_scope { order(id: :asc) }

  private
  def sanitize_value
    self.value = strip_tags(value)
    self.completion_current_value = strip_tags(completion_current_value.to_s).to_i
    self.completion_target_value = strip_tags(completion_target_value.to_s).to_i
  end

end
