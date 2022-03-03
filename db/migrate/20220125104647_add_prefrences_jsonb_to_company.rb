class AddPrefrencesJsonbToCompany < ActiveRecord::Migration[6.1]
  def change
    add_column :companies, :preferences, :jsonb, default: {}, null: false
    add_index  :companies, :preferences, using: :gin
  end
end
