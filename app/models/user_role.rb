class UserRole < ApplicationRecord
  has_many :user_company_enablements
  has_many :users, through: :user_company_enablements

  validates :name, presence: true

  CEO = "CEO"
  ADMIN = "Admin"
  NORMAL = "Employee"
  LEADERSHIP = "Leadership Team"
end
