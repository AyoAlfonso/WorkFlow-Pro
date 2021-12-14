class SubInitiative < ApplicationRecord
  include HasCreator
  include HasOwner
  include ActionView::Helpers::SanitizeHelper
  include StatsHelper

  before_save :sanitize_description

  belongs_to :quarterly_goal
  has_many :milestones, as: :milestoneable
  has_many :key_elements, as: :elementable
  has_many :objective_logs, as: :objecteable
  accepts_nested_attributes_for :key_elements, :milestones

  scope :owned_by_user, ->(user) { where(owned_by_id: user.id) }
  scope :filter_by_team_id, ->(team_id) { where(owned_by_id: Team.find(team_id).users.pluck(:id)) }

  def create_milestones_for_sub_initiative(current_user, company)
    fiscal_quarter_start_date = company.current_fiscal_start_date + (13.weeks * (self.quarter-1))
    # fiscal_quarter_start_date = fiscal_quarter_start_date + 1.year if self.quarterly_goal.annual_initiative.fiscal_year >= company.current_fiscal_year
    fiscal_quarter_start_date_closest_monday = fiscal_quarter_start_date.monday? ? fiscal_quarter_start_date : fiscal_quarter_start_date.next_occurring(:monday)
    13.times do |index|
      Milestone.create!(
        milestoneable: self,
        description: "",
        week: index + 1,
        week_of: fiscal_quarter_start_date_closest_monday + (1.week * index),
        created_by: current_user,
      )
    end
  end

    def derived_status 
        previous_week_start = get_beginning_of_last_or_current_work_week_date(Time.now)
        objective_logs_scores = Array.new
        self.key_elements.filter_by_objective_logs_and_updated_on_key_elements(previous_week_start).as_json({methods: [:owned_by],
                        include: {
                          objective_logs: { methods: [:owned_by] }}
          }).map do |element|
              completion_target_value = element["completion_target_value"] == 0 ? 1 : element["completion_target_value"]
              score  = element["greater_than"] ? (element["completion_current_value"] / completion_target_value)  * 100 : ((element["completion_target_value"] + element["completion_target_value"] - element["completion_current_value"]) / completion_target_value) * 100;
              objective_logs_scores.push(score.round(2))
            end
        avr_score = objective_logs_scores.sum.fdiv(objective_logs_scores.size) rescue 0
        return avr_score >= 85 ? "On Track" : avr_score >= 70 ?  "Needs Attention" :  avr_score >= 1 ? "Behind" : "None"
    end
 
  def quarter
    self.quarterly_goal.quarter
  end

  private

  def sanitize_description
    self.description = strip_tags(description)
  end
end
