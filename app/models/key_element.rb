class KeyElement < ApplicationRecord
  acts_as_paranoid column: :deleted_at
  include ActionView::Helpers::SanitizeHelper
  include HasOwner
  include LogEnum

  before_save :sanitize_value
  has_many :objective_logs, as: :child, dependent: :destroy
  belongs_to :elementable, :polymorphic => true
  belongs_to :user, optional: true

  belongs_to :annual_initiative, -> { where(key_elements: { elementable_type: "AnnualInitiative" })  }, foreign_key: "elementable_id", optional: true
  belongs_to :quarterly_goal, -> { where(key_elements: { elementable_type: "QuarterlyGoal" })  }, foreign_key: "elementable_id", optional: true
  belongs_to :sub_initiative, -> { where(key_elements: { elementable_type: "SubInitiative" })  }, foreign_key: "elementable_id", optional: true
  validates :completion_type, :status, :elementable_id, :elementable_type, :completion_target_value, :owned_by_id, :greater_than, presence: true

  scope :optimized, -> { includes([:objective_logs, :annual_initiative, :owned_by, :quarterly_goal, :sub_initiative]) }
# 
  # completion_type of binary is boolean, if completed_at.present?
  # completion_type of currency is in cents (data type integer)
  enum completion_type: { binary: 0, numerical: 1, percentage: 2, currency: 3 }

  scope :current_user_and_elementable_type, ->(user, elementable_type) {
        elementable_type == "QuarterlyGoal" ?
          includes(:quarterly_goal).where(quarterly_goals: { closed_at: nil })
          .where(
          { owned_by_id: user, elementable_type:  elementable_type  }
        ) 
        : elementable_type == "AnnualInitiative" ?
          includes(:annual_initiative).where(annual_initiatives: { closed_at: nil})
          .where(
        { owned_by_id: user,elementable_type:  elementable_type  }
        ) : includes(:sub_initiative).where(sub_initiatives: { closed_at: nil }).where(
         { owned_by_id: user, elementable_type:  elementable_type  }
        )
    }

  default_scope { order(id: :asc) }

  scope :filter_by_objective_logs_and_updated_on_key_elements, ->(updated_at){
      where(_exists(ObjectiveLog.where("objective_logs.child_type = ? AND objective_logs.updated_at > ?", "KeyElement", updated_at)))
  }
  scope :filter_by_objective_logs_type, ->(){
      where(_exists(ObjectiveLog.where("objective_logs.child_type = ?", "KeyElement")))
  }
  # Still in the process of using this, remove the Dependency if not successful
  scope :filter_by_objective_logs_and_updated_on_absent_key_elements, ->(updated_at){
      where(_not_exists(ObjectiveLog.where("objective_logs.child_type = ?", "KeyElement")))
  }

  def elementable_data
    self.elementable
  end

  def self._not_exists(scope)
    "NOT #{_exists(scope)}"
  end

  def self._exists(scope)
    "EXISTS(#{scope.to_sql})"
  end

  private

  def sanitize_value
    self.value = strip_tags(value)
    self.completion_current_value = strip_tags(completion_current_value.to_s).to_i
    self.completion_target_value = strip_tags(completion_target_value.to_s).to_i
  end
end
