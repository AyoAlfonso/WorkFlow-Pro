class AddTimeZoneToCompany < ActiveRecord::Migration[6.0]
  def change
    add_column :companies, :timezone, :string
  end
end
