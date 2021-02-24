class ModifyActsAsTaggableTags < ActiveRecord::Migration[6.0]
  def change
    remove_index :tags, :name
    remove_index :tags, :team_id
    add_index :tags, [:name, :team_id], unique: true
  end
end
