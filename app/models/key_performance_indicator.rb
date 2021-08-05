class KeyPerformanceIndicator < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include HasCreator
  include HasOwner
  include HasViewer

  before_save :sanitize_description
  enum unit_type: { percentage: 0, numerical: 1, currency: 2 }
  # alias_attribute :weeks

  validates :description, :created_by, :viewers, :unit_type, :target_value, :greater_than, presence: true
  has_many :scorecard_logs


  private

  def sanitize_description
    self.description = strip_tags(description)
  end
end
