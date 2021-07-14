class KeyPerformanceIndicator < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include HasCreator
  include HasGenericOwner

  before_save :sanitize_description

  validates :description, :unit_type, presence: true
  enum unit_type: { percentage: "percentage", numerical: "numerical", currency: "currency" }
  # alias_attribute :weeks

  validates :description, :created_by, :owner_type, :owned_by, :unit_type, :target_value, presence: true
  enum owner_type: { user: 0, team: 1, company: 2 }
  has_many :scorecard_logs

  private

  def sanitize_description
    self.description = strip_tags(description)
  end
end
