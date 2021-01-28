class AddCurrentSelectedCompanyToUser < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :default_selected_company, foreign_key: { to_table: :users }
  end
end
