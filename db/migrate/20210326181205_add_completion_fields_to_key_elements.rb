class AddCompletionFieldsToKeyElements < ActiveRecord::Migration[6.0]
  def change
    add_column :key_elements, :completion_type, :integer
    add_column :key_elements, :completion_current_value, :integer
    add_column :key_elements, :completion_target_value, :integer
  end

  def data
    # ensure all existing key_elements have a completion type
    KeyElement.update_all(completion_type: 0, completion_current_value: 0, completion_target_value: 1)
  end
end
