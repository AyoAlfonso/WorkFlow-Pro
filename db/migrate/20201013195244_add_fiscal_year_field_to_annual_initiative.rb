class AddFiscalYearFieldToAnnualInitiative < ActiveRecord::Migration[6.0]
  def change
    add_column :annual_initiatives, :fiscal_year, :integer
  end

  def data
    AnnualInitiative.all.each do |ai|
      if ai.company.present?
        ai.update!({
          fiscal_year: ai.company.current_fiscal_year
        })
      else
        ai.update!({
          fiscal_year: ai.owned_by.company.current_fiscal_year
        })
      end
    end
  end
end
