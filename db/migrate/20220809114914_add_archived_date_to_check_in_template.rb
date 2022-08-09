class AddArchivedDateToCheckInTemplate < ActiveRecord::Migration[6.1]
  def change
    add_column :check_in_templates, :archived_date, :datetime, null: true
  end
end
