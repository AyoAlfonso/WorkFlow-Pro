class RenameChildOnCheckInTemplatesToParent < ActiveRecord::Migration[6.1]
  def change
    remove_column :check_in_templates, :child
    add_column :check_in_templates, :parent, :integer, null: true
  end
end
