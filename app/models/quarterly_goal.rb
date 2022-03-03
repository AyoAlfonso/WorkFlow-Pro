class QuarterlyGoal < ApplicationRecord
  acts_as_paranoid column: :deleted_at
  include HasCreator
  include HasOwner
  include ActionView::Helpers::SanitizeHelper
  include StatsHelper
  before_save :sanitize_description

  belongs_to :annual_initiative
  has_many :milestones, as: :milestoneable, dependent: :destroy
  has_many :objective_logs, as: :objecteable, dependent: :destroy
  has_many :key_elements, as: :elementable, dependent: :destroy
  has_many :sub_initiatives, dependent: :destroy
  accepts_nested_attributes_for :key_elements, :milestones

  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :sort_by_not_closed, -> { where(closed_at: nil) }
  scope :sort_by_closed, -> { where.not(closed_at: nil) }
  scope :owned_by_user, ->(user) { where(owned_by_id: user.id) }
  scope :for_quarter, ->(quarter) { where(quarter: quarter) }
  scope :filter_by_team_id, ->(team_id) { where(owned_by_id: Team.find(team_id).users.pluck(:id)) }
  scope :present_or_future_quarterly, ->(company) {
      joins(:annual_initiative)
        .where("(annual_initiatives.fiscal_year = ? AND quarter >= ?) OR annual_initiatives.fiscal_year > ?",
               company.current_fiscal_year, company.current_fiscal_quarter, company.current_fiscal_year)
    }
  scope :past_until_present, ->(company) {
  joins(:annual_initiative)
    .where("(annual_initiatives.fiscal_year <= ? AND quarter <= ?)",
            company.current_fiscal_year, company.current_fiscal_quarter)
}
  scope :optimized, ->() { includes([ :key_elements, :milestones, { owned_by: { avatar_attachment: :blob } }]) }

  def create_milestones_for_quarterly_goal(current_user, company)
    fiscal_quarter_start_date = company.current_fiscal_start_date + (13.weeks * (self.quarter-1))
    # fiscal_quarter_start_date = fiscal_quarter_start_date + 1.year if self.annual_initiative.fiscal_year >= company.current_fiscal_year
    fiscal_quarter_start_date_closest_monday = fiscal_quarter_start_date.monday? ? fiscal_quarter_start_date : fiscal_quarter_start_date.next_occurring(:monday)
    # existing_milestone = check_for_existing_milestones_for_quarterly_goal(company,fiscal_quarter_start_date_closest_monday)
    
    # unless existing_milestone.present?
      13.times do |index|
        Milestone.create!(
          milestoneable: self,
          description: "",
          week: index + 1,
          week_of: fiscal_quarter_start_date_closest_monday + (1.week * index),
          created_by: current_user,
        )
      end
    # end
  end
  
  def check_for_existing_milestones_for_quarterly_goal(company, fiscal_quarter_start_date_closest_monday)
    return Milestone.where(week: 1, week_of: fiscal_quarter_start_date_closest_monday , milestoneable_type: "QuarterlyGoal")
  end

  private

  def sanitize_description
    self.description = strip_tags(description)
  end
end
