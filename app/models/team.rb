class Team < ApplicationRecord
  belongs_to :company
  has_many :team_user_enablements
  has_many :users, through: :team_user_enablements
  has_many :issues
  has_many :meetings

  accepts_nested_attributes_for :team_user_enablements, allow_destroy: true
end
