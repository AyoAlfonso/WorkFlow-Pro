class UserCompanyEnablement < ApplicationRecord
  belongs_to :user
  belongs_to :company
  belongs_to :user_role
end
