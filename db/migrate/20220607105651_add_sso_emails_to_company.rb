class AddSsoEmailsToCompany < ActiveRecord::Migration[6.1]
  def change
    add_column :companies, :sso_emails_embed, :text
  end
end
