class AddTypeFieldToCheckInTemplate < ActiveRecord::Migration[6.1]
  def change
    add_column :check_in_templates, :type, :integer, default: 0
  end
end
