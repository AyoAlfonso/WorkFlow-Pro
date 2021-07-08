class KeyPerformanceIndicator < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include HasCreator
  include HasGenericOwner
  # alias_attribute :weeks

  before_save :sanitize_description

  validates :description, :owner_type, :target_value, :created_by, :unit_type, presence: true
  enum unit_type: { percentage: "percentage", numerical: "numerical", currency: "currency" }
  enum owner_type: { user: 0, team: 1, company: 2 }
  has_many :scorecard_logs

  private
  def sanitize_description
    self.description = strip_tags(description)
  end
end
