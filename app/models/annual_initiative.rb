class AnnualInitiative < ApplicationRecord
  include HasCreator
  include HasOwner

  belongs_to :company, optional: true
  has_many :quarterly_goals, dependent: :destroy
  has_many :comments, as: :commentable
  # has_many :attachments
  has_many :key_elements, as: :elementable

  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :owned_by_user, -> (user) { where(owned_by_id: user.id).where(company_id: nil) }
  scope :for_users_company, -> (user) { where(company_id: user.company_id ) }
end
