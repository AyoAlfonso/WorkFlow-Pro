class AddCompanyReferenceToAnnualInitiatives < ActiveRecord::Migration[6.0]
  def change
    add_reference :annual_initiatives, :company, null: true, foreign_key: true
  end
end
