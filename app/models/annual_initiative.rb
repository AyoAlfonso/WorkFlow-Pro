class AnnualInitiative < ApplicationRecord
  acts_as_paranoid column: :deleted_at

  amoeba do
    enable
    recognize [:has_many, has_many: :through]
    include_association :sub_initiatives
    exclude_association :comments

    customize(lambda { |original_post,new_post|
       current_company = Company.find(new_post.company_id)
       quarter = current_company.quarter_for_creating_quarterly_goals
       new_post.quarterly_goals.map { |quarterly_goal| quarterly_goal.quarter = [0,2,3,4,1][quarter] }
    })
  end

  include HasCreator
  include HasOwner
  
  include ActionView::Helpers::SanitizeHelper
  include StatsHelper

  before_save :sanitize_description

  belongs_to :company, optional: true
  has_many :quarterly_goals, dependent: :destroy
  has_many :sub_initiatives, through: :quarterly_goals, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :milestones, as: :milestoneable, dependent: :destroy
  has_many :key_elements, as: :elementable, dependent: :destroy
  accepts_nested_attributes_for :key_elements, :milestones

  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :user_current_company, ->(company_id) { where(company_id: company_id) }
  scope :owned_by_user, ->(user) { where(owned_by_id: user.id).where(company_id: nil) }
  scope :for_company_id, ->(company_id) { where(company_id: company_id) }
  scope :for_company_current_year_and_future, ->(company_current_fiscal_year) { where("fiscal_year >= ?", company_current_fiscal_year) }
  scope :sort_by_closed, -> { where('closed_at IS NOT ?', nil) }
  scope :sort_by_not_closed, -> { where(closed_at: nil) }

  #We can make this a reusable pattern, when it used in multiple models
  scope :sort_by_closed_quarterly_goals, ->() {
      includes(:quarterly_goals).where.not(quarterly_goals: { closed_at: nil })
    }
  
  private
  def sanitize_description
    self.description = strip_tags(description)
  end
end
