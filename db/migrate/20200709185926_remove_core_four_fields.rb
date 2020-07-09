class RemoveCoreFourFields < ActiveRecord::Migration[6.0]
  def change
    remove_column :core_fours, :core_1
    remove_column :core_fours, :core_2
    remove_column :core_fours, :core_3
    remove_column :core_fours, :core_4
  end
end
