class AddDeletedAtToCheckInTemplate < ActiveRecord::Migration[6.1]
  def change
    add_column :check_in_templates, :deleted_at, :datetime
    add_index :check_in_templates, :deleted_at

    add_index :check_in_templates, :updated_at,  where: "deleted_at IS NULL"

    remove_index  :check_in_templates, :company_id
    add_index :check_in_templates, :company_id,  where: "deleted_at IS NULL"
  end
end
