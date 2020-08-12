class Team < ApplicationRecord
  belongs_to :company
  has_many :team_user_enablements
  has_many :users, through: :team_user_enablements
  has_many :issues
  has_one :team_lead

  accepts_nested_attributes_for :team_user_enablements, allow_destroy: true
end
