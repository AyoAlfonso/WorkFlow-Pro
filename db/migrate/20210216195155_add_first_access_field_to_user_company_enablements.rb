class AddFirstAccessFieldToUserCompanyEnablements < ActiveRecord::Migration[6.0]
  def change
    add_column :user_company_enablements, :first_time_access, :boolean, default: true
  end
end
