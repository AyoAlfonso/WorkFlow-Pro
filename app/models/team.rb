class Team < ApplicationRecord
  belongs_to :company
  has_many :team_user_enablements
  has_many :users, through: :team_user_enablements
  has_many :issues
end
