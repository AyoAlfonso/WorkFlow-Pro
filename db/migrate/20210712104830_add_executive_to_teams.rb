class AddExecutiveToTeams < ActiveRecord::Migration[6.0]
  def change
    add_column :teams, :executive, :integer, default: 0
  end
end
