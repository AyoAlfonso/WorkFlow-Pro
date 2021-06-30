class AddYpoTagToCompany < ActiveRecord::Migration[6.0]
  def change
    add_column :companies, :forum_type, :integer
  end

  def data
    Company.find_each(batch_size: 100) do |company|
      if company.display_format == "Forum"
        company.forum_type = 2
        company.save!
      end
    end
  end
end
