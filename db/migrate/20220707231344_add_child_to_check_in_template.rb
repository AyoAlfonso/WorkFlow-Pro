class AddChildToCheckInTemplate < ActiveRecord::Migration[6.1]
  def change
    add_column :check_in_templates, :child, :string, null: true
  end
end
