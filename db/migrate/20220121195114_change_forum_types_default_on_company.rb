class ChangeForumTypesDefaultOnCompany < ActiveRecord::Migration[6.1]
  def up
    change_column :companies, :forum_type, :integer, :default => 0
  end

  def down
    change_column :companies, :forum_type, :integer, :default=>nil
  end

  def data
     Company.find_each(batch_size: 100) do |company|
        if company.display_format == "Forum"
         unless company.forum_type.present?
          company.forum_type = 0
          company.save!
         end
        end
      end
  end
end
