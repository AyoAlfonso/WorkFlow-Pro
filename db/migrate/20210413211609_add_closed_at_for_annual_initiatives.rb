class AddClosedAtForAnnualInitiatives < ActiveRecord::Migration[6.0]
  def change
    add_column :annual_initiatives, :closed_at, :date
    add_column :quarterly_goals, :closed_at, :date
  end
end
