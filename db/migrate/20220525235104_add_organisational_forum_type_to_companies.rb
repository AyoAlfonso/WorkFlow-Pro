class AddOrganisationalForumTypeToCompanies < ActiveRecord::Migration[6.1]
  def change
    add_column :companies, :organisational_forum_type, :integer
  end

  def data
    Company.find_each(batch_size: 100) do |company|
      if company.display_format == "Forum" && company.forum_type == "Organisation"
        company.organisational_forum_type = 1
        company.save!
      end
    end
  end
end
