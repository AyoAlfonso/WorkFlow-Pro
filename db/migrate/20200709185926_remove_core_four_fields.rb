class RemoveCoreFourFields < ActiveRecord::Migration[6.0]
  def change
    remove_column :core_fours, :core_1, :text
    remove_column :core_fours, :core_2, :text
    remove_column :core_fours, :core_3, :text
    remove_column :core_fours, :core_4, :text
  end
end
