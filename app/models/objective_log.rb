class ObjectiveLog < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include StatsHelper
  include HasOwner

  belongs_to :objecteable, :polymorphic => true, optional: true
  belongs_to :key_element, -> { where(objective_logs: { objecteable_type: "KeyElement" }) }, foreign_key: "objecteable_id", optional: true
  belongs_to :milestone, -> { where(objective_logs: { objecteable_type: "Milestone" }) }, foreign_key: "objecteable_id", optional: true

  validates :score, :week, :fiscal_quarter, :fiscal_year, :objecteable_id, :owned_by_id, :objecteable_type, presence: true

  scope :created_by_user, ->(user) { where(owned_by_id: user) }
  scope :created_between, ->(date_start, date_end) { where("created_at >= ? AND created_at < ?", date_start, date_end) }

end
