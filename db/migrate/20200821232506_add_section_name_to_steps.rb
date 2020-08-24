class AddSectionNameToSteps < ActiveRecord::Migration[6.0]
  def change
    add_column :steps, :section_name, :string
  end
end
