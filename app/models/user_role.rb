class UserRole < ApplicationRecord
  has_many :users
  validates :name, presence: true

  CEO = "CEO"
  ADMIN = "Admin"
  NORMAL = "Employee"
  LEADERSHIP = "Leadership Team"
end
