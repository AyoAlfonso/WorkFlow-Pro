class CreateDefaultAdminTemplate < ActiveRecord::Migration[6.0]
  def change
    create_table :default_admin_templates do |t|
      t.string :title
      t.integer :template_type
      t.text :body
      t.timestamps
    end
  end

  def data
    DefaultAdminTemplate.template_types.map do |type|
      DefaultAdminTemplate.create!(title: type[0], template_type: type[1], body: "")
    end
    Company.find_each(batch_size: 100) do |company|
      if company.description_templates.empty?
        DefaultAdminTemplate.find_each do |template|
          DescriptionTemplate.create!(template_type: template.template_type, company_id: company.id, body: template.body, title: template.title)
        end
      end
    end
  end
end
