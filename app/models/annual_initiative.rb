class AnnualInitiative < ApplicationRecord
  include HasCreator
  include HasOwner
  include ActionView::Helpers::SanitizeHelper

  before_save :sanitize_description

  belongs_to :company, optional: true
  has_many :quarterly_goals, dependent: :destroy
  has_many :comments, as: :commentable
  # has_many :attachments
  has_many :key_elements, as: :elementable
  accepts_nested_attributes_for :key_elements

  default_scope { order(id: :asc) }

  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :owned_by_user, -> (user) { where(owned_by_id: user.id).where(company_id: nil) }
  scope :for_users_company, -> (user) { where(company_id: user.company_id ) }

  private
  def sanitize_description
    self.description = strip_tags(description)
  end
end
