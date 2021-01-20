class AddUserTitleToUserCompanyEnablements < ActiveRecord::Migration[6.0]
  def change
    add_column :user_company_enablements, :user_title, :string
  end
end
