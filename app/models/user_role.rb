class UserRole < ApplicationRecord
  has_many :users
  validates :name, presence: true

  CEO = "ceo"
  ADMIN = "admin"
  NORMAL = "normal_user"
  LEADERSHIP = "leadership"
end
