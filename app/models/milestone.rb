class Milestone < ApplicationRecord
  include HasCreator

  enum status: { unstarted: 0, incomplete: 1, in_progress: 2, completed: 3 }
  belongs_to :milestoneable, :polymorphic => true, optional: true

  belongs_to :quarterly_goal, -> { where(milestones: { milestoneable_type: "QuarterlyGoal" }) }, foreign_key: "milestoneable_id", optional: true
  belongs_to :sub_initiative, -> { where(milestones: { milestoneable_type: "SubInitiative" }) }, foreign_key: "milestoneable_id", optional: true

  default_scope { order(id: :asc) }

  scope :sort_by_created_at_date, -> { order(created_at: :asc) }

  scope :by_start_and_end_date, ->(start_date, end_date) {
          where("week_of >=? AND week_of <= ?", start_date, end_date)
        }

  scope :current_week_for_user, ->(week_start, user, milestoneable_type) {
          milestoneable_type == "QuarterlyGoal" ?
            joins(:quarterly_goal).where(quarterly_goals: { owned_by: user }).where(
            "week_of >=? AND week_of < ?", week_start.to_date, week_start.end_of_week.to_date
          ) :
            joins(:sub_initiative).where(sub_initiatives: { owned_by: user }).where(
            "week_of >=? AND week_of < ?", week_start.to_date, week_start.end_of_week.to_date
          )
        }

  #TODO: ADD THE YEAR FOR THE QUARTER AS WELL - current_fiscal_year
  scope :for_user_on_quarter, ->(user, quarter, milestoneable_type) {
          milestoneable_type == "QuarterlyGoal" ?
            joins(:quarterly_goal).where(quarterly_goals: { owned_by: user, quarter: quarter }) :
            joins(:sub_initiative).where(sub_initiatives: { owned_by: user, quarter: quarter })
        }
end
