class AddClosedAtForAnnualInitiatives < ActiveRecord::Migration[6.0]
  def change
    add_column :annual_initiatives, :closed_at, :date
  end
end
