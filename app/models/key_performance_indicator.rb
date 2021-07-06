class KeyPerformanceIndicator < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include HasCreator
  include HasGenericOwner
  # alias_attribute :weeks


  before_save :sanitize_description

  validates :description, :target_value, :created_by, :unit_type, presence: true
  enum unit_type: { percentage: "percentage", numerical: "numerical", currency: "currency" }
  has_many :scorecard_logs

  private
  def sanitize_description
    self.description = strip_tags(description)
  end
end
