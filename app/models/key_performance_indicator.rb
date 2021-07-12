class KeyPerformanceIndicator < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include HasCreator
  include HasGenericOwner

  before_save :sanitize_description

  enum unit_type: { percentage: 0, numerical: 1, currency: 2 }
  # alias_attribute :weeks

  validates :description, :created_by, :owner_type, :owned_by_id, :unit_type, :target_value, presence: true
  enum owner_type: { user: 0, team: 1, company: 2 }
  has_many :scorecard_logs

  private

  def sanitize_description
    self.description = strip_tags(description)
  end
end
