class ModifyActsAsTaggableRelationship < ActiveRecord::Migration[6.0]
  def change
    remove_index :tags, :company_id
    remove_index :tags, :user_id
    add_index :tags, [:name, :company_id], unique: true
    add_index :tags, [:name, :user_id], unique: true
  end
end
