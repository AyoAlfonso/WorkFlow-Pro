class AddStartingValueToKeyElements < ActiveRecord::Migration[6.0]
  def change
    add_column :key_elements, :completion_starting_value, :integer, default: 0
  end
end
