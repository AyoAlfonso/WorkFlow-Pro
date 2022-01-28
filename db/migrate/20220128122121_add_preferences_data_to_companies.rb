class AddPreferencesDataToCompanies < ActiveRecord::Migration[6.1]
  def data
     Company.find_each(batch_size: 100) do |company|
      if company.display_format == "Company"
        company.preferences = {:foundational_four => true,:company_objectives => true, :personal_objectives => true}
      end

      if company.display_format == "Forum" &&
        if company.forum_type == "Organisation"
          company.preferences = {:foundational_four => false,:company_objectives => true, :personal_objectives => true}
        else
          company.preferences = {:foundational_four => false,:company_objectives => true, :personal_objectives => true}
        end
      end
      company.save!
    end
  end
end