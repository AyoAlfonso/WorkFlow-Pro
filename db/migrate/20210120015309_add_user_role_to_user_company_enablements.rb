class AddUserRoleToUserCompanyEnablements < ActiveRecord::Migration[6.0]
  def change
    add_reference :user_company_enablements, :user_role, foreign_key: true
  end
end
