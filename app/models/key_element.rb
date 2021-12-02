class KeyElement < ApplicationRecord
  include ActionView::Helpers::SanitizeHelper

  before_save :sanitize_value
  has_many :objective_logs, as: :objecteable
  belongs_to :elementable, :polymorphic => true
  belongs_to :user, optional: true

  belongs_to :quarterly_goal, -> { where(key_elements: { elementable_type: "QuarterlyGoal" }) }, foreign_key: "elementable_id", optional: true
  belongs_to :sub_initiative, -> { where(key_elements: { elementable_type: "SubInitiative" }) }, foreign_key: "elementable_id", optional: true
  belongs_to :annual_initiative, -> { where(key_elements: { elementable_type: "AnnualInitiative" }) }, foreign_key: "elementable_id", optional: true

  # completion_type of binary is boolean, if completed_at.present?
  # completion_type of currency is in cents (data type integer)
  enum completion_type: { binary: 0, numerical: 1, percentage: 2, currency: 3 }
  enum status: { unstarted: 0, incomplete: 1, in_progress: 2, completed: 3, done: 4 }

  scope :current_week_for_user, ->(user, elementable_type) {
        elementable_type == "QuarterlyGoal" ?
          includes(:quarterly_goal).where(quarterly_goals: { closed_at: nil })
          .where(
          { owned_by_id: user }
        ) 
        : elementable_type == "AnnualInitiative" ?
          joins(:annual_initiative).where(annual_initiatives: { closed_at: nil})
          .where(
        { owned_by_id: user }
        ) : joins(:sub_initiative).where(sub_initiatives: { closed_at: nil }).where(
         { owned_by_id: user }
        )
    }

  default_scope { order(id: :asc) }



  private

  def sanitize_value
    self.value = strip_tags(value)
    self.completion_current_value = strip_tags(completion_current_value.to_s).to_i
    self.completion_target_value = strip_tags(completion_target_value.to_s).to_i
  end
end
