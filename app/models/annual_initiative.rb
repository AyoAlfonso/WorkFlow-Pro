class AnnualInitiative < ApplicationRecord
  include HasCreator
  include HasOwner

  belongs_to :company, optional: true
  has_many :quarterly_goals
  has_many :comments, as: :commentable
  # has_many :attachments

  scope :sort_by_created_date, -> { order(created_at: :asc) }
  scope :for_user, -> { where(company_id: nil) }
  scope :for_company, -> { where.not(company_id: nil) }
end
