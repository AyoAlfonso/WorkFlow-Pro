class QuarterlyGoal < ApplicationRecord
  include HasCreator
  include HasOwner
  include ActionView::Helpers::SanitizeHelper

  before_save :sanitize_description

  belongs_to :annual_initiative
  has_many :milestones, dependent: :destroy
  has_many :key_elements, as: :elementable
  accepts_nested_attributes_for :key_elements, :milestones

  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :owned_by_user, -> (user) { where(owned_by_id: user.id) }
  scope :filter_by_team_id, -> (team_id) {}

  def create_milestones_for_quarterly_goal(current_user)
    company = current_user.company
    fiscal_quarter_start_date = company.fiscal_year_start + (13.weeks * (self.quarter-1))
    13.times do |index|
      Milestone.create!(
        quarterly_goal_id: self.id, 
        description: "Enter Description", 
        status: 0, 
        week: index + 1, 
        week_of: fiscal_quarter_start_date + (1.week * index),
        created_by: current_user
      )
    end
  end

  def filter_by_team_id(team_id)
    user_ids = Team.find(team_id).users.pluck(:id)
    self.where(user_id: user_ids)
  end

  private
  def sanitize_description
    self.description = strip_tags(description)
  end
end
