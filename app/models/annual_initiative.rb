class AnnualInitiative < ApplicationRecord
  include HasCreator
  include HasOwner
  include ActionView::Helpers::SanitizeHelper

  before_save :sanitize_description

  belongs_to :company, optional: true
  has_many :quarterly_goals, dependent: :destroy
  has_many :sub_initiatives, through: :quarterly_goals
  has_many :comments, as: :commentable
  # has_many :attachments
  has_many :key_elements, as: :elementable
  accepts_nested_attributes_for :key_elements

  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :user_current_company, ->(company_id) { where(company_id: company_id) }
  scope :owned_by_user, ->(user) { where(owned_by_id: user.id).where(company_id: nil) }
  scope :for_company_id, ->(company_id) { where(company_id: company_id) }
  scope :for_company_current_year_and_future, ->(company_current_fiscal_year) { where("fiscal_year >= ?", company_current_fiscal_year) }
  scope :sort_by_closed_at, -> { where.not(closed_at: nil) }
  scope :sort_by_not_closed_at, -> { where(closed_at: nil) }
  private

  def sanitize_description
    self.description = strip_tags(description)
  end
end
