class ObjectiveLog < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper
  include StatsHelper
  include HasOwner
  include LogEnum

  belongs_to :objecteable, :polymorphic => true, optional: true
  belongs_to :key_element, -> { where(objective_logs: { child_type: "KeyElement" }) }, foreign_key: "child_id", optional: true
  belongs_to :milestone, -> { where(objective_logs: { child_type: "Milestone" }) }, foreign_key: "child_id", optional: true
  belongs_to :annual_initiative, -> { where(objective_logs: { objecteable_type: "AnnualInitiative" }) }, foreign_key: "objecteable_id", optional: true
 
  belongs_to :sub_initiative, -> { where(objective_logs: { objecteable_type: "SubInitiative" }) }, foreign_key: "objecteable_id", optional: true
  belongs_to :quarterly_goal, -> { where(objective_logs: { objecteable_type: "QuarterlyGoal" }) }, foreign_key: "objecteable_id", optional: true

  validates :score, :week, :fiscal_quarter, :fiscal_year, :objecteable_id, :owned_by_id, :objecteable_type, presence: true

  scope :owned_by_user, ->(user) { where(owned_by_id: user) }
  scope :created_between, ->(date_start, date_end) { where("created_at >= ? AND created_at < ?", date_start, date_end) }
  scope :sort_by_creation_date, -> { order(adjusted_date: :desc) }

  # after_save :verify_company_static_data, :verify_description_templates

end
