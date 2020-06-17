class AddPersonalVisionToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :personal_vision, :text
  end
end
