class KeyActivity < ApplicationRecord
  belongs_to :user

  scope :created_by_user, -> (user) { where(user: user) }
end
