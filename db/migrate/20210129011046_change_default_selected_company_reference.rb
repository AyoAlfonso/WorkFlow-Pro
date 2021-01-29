class ChangeDefaultSelectedCompanyReference < ActiveRecord::Migration[6.0]
  def change
    remove_reference :users, :default_selected_company, foreign_key: { to_table: :users }
    add_reference :users, :default_selected_company, foreign_key: { to_table: :companies }
  end
end
