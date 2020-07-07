class AddFiscalYearToCompany < ActiveRecord::Migration[6.0]
  def change
    add_column :companies, :fiscal_year_start, :date
  end
end
