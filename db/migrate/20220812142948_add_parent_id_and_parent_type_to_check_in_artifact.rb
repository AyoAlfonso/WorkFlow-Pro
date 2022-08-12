class AddParentIdAndParentTypeToCheckInArtifact < ActiveRecord::Migration[6.1]
  def change
    add_column :notifications, :parent_id, :integer
    add_column :notifications, :parent_type, :string
  end
end
