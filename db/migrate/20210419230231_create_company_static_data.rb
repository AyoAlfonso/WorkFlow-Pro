class CreateCompanyStaticData < ActiveRecord::Migration[6.0]
  def change
    create_table :company_static_data do |t|
      t.string :field
      t.text :value
      t.references :company, null: false, foreign_key: true
      t.timestamps
    end
  end

  def data
    Company.all.each do |company|
      CompanyStaticData.create!(field: 'annual_objective', value: 'Annual Objective', company: company)
      CompanyStaticData.create!(field: 'quarterly_initiative', value: 'Quarterly Initiative', company: company)
      CompanyStaticData.create!(field: 'sub_initiative', value: 'Sub Initiative', company: company)
    end
  end
end
