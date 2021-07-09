class AddGreaterThanToKeyElements < ActiveRecord::Migration[6.0]
  def change
    add_column :key_elements, :greater_than, :boolean
  end
end
