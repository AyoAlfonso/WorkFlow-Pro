class AddTypeFieldToCheckInTemplate < ActiveRecord::Migration[6.1]
  def change
    add_column :check_in_templates, :owner_type, :integer, default: 0
    add_column :check_in_templates, :viewers, :jsonb 
    add_reference :check_in_templates, :company, null: true
  end
end
