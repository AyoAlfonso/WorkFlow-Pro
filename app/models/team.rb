class Team < ApplicationRecord
  include HasDefaultAvatarColor
  belongs_to :company
  has_many :team_user_enablements
  has_many :users, through: :team_user_enablements
  has_many :issues
  has_many :meetings

  accepts_nested_attributes_for :team_user_enablements, allow_destroy: true

  def is_lead?(user)
    team_user_enablements.where(role: :team_lead, user: user).present?
  end

  def active
    #eventually add deactivation rules and items
    true
  end
end
