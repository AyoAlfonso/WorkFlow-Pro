class UserCompanyEnablement < ApplicationRecord
  belongs_to :user
  belongs_to :company
  belongs_to :user_role

  scope :active_users, -> { where.not(role: Role::Coach) } #later on we can extend inactive users, etc.
end
