class ModifyDataForAnnualinitiativeFiscalYear < ActiveRecord::Migration[6.0]
  def data
      AnnualInitiative.all.each do |ai|
        ai.update!({
           fiscal_year: ai.company.year_for_creating_annual_initiatives
       }) if ai.company.present? && (ai.fiscal_year > Time.zone.now.year)
    end
  end
end
