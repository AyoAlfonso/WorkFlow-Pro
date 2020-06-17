class AnnualInitiative < ApplicationRecord
  include HasCreator
  include HasOwner

  enum initiative_type: [:personal, :company]
  has_many :quarterly_goals
  has_many :comments, as: :commentable
  # has_many :attachments
end
