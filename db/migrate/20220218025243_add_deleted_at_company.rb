class AddDeletedAtCompany < ActiveRecord::Migration[6.1]
  def change
    add_column :companies, :deleted_at, :datetime
    add_index :companies, :deleted_at
    
    remove_index  :companies, :preferences
    add_index :companies, :preferences,  where: "deleted_at IS NULL"
  end
end
