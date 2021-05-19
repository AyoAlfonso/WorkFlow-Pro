class SubInitiative < ApplicationRecord
  include HasCreator
  include HasOwner
  include ActionView::Helpers::SanitizeHelper

  before_save :sanitize_description

  belongs_to :quarterly_goal
  has_many :milestones, as: :milestoneable
  has_many :key_elements, as: :elementable
  accepts_nested_attributes_for :key_elements, :milestones

  scope :owned_by_user, -> (user) { where(owned_by_id: user.id) }
  scope :filter_by_team_id, -> (team_id) {where(owned_by_id: Team.find(team_id).users.pluck(:id))}
 
  def create_milestones_for_sub_initiative(current_user, company)
    fiscal_quarter_start_date = company.current_fiscal_start_date + (13.weeks * (self.quarter-1))
    fiscal_quarter_start_date = fiscal_quarter_start_date + 1.year if self.quarterly_goal.annual_initiative.fiscal_year != company.current_fiscal_year
    fiscal_quarter_start_date_closest_monday = fiscal_quarter_start_date.monday? ? fiscal_quarter_start_date : fiscal_quarter_start_date.next_occurring(:monday)
    13.times do |index|
      Milestone.create!(
        milestoneable: self,
        description: "",
        week: index + 1, 
        week_of: fiscal_quarter_start_date_closest_monday + (1.week * index),
        created_by: current_user
      )
    end
  end

  def quarter
    self.quarterly_goal.quarter
  end

  private
  def sanitize_description
    self.description = strip_tags(description)
  end
end