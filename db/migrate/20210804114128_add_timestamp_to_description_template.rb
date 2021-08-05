class AddTimestampToDescriptionTemplate < ActiveRecord::Migration[6.0]
  def change
    add_column :description_templates, :created_at, :datetime, null: false
    add_column :description_templates, :updated_at, :datetime, null: false
  end

  def data
    Company.find_each(batch_size: 100) do |company|
      if company.description_templates.empty? 
	      DescriptionTemplate.create!(template_type: 0, company_id: company.id, body: "", title: "KPI Template" )
        DescriptionTemplate.create!(template_type: 1, company_id: company.id, body: "", title: "Objective Template" )
        DescriptionTemplate.create!(template_type: 2, company_id: company.id, body: "", title: "Initiative Template"  )
			end
    end
  end
end
