class AddStatusAndOwnerToKeyElements < ActiveRecord::Migration[6.0]
  def change
    add_column :key_elements, :status, :integer, default: 0
    add_reference :key_elements, :owned_by, references: :user, null: true
  end
end
