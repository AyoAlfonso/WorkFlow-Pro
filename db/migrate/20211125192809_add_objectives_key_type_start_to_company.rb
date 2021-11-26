class AddObjectivesKeyTypeStartToCompany < ActiveRecord::Migration[6.1]
  def change
    add_column :companies, :objectives_key_type, :integer, default: 1
  end
end

