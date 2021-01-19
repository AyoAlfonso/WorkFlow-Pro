class AddDescriptionTextToSteps < ActiveRecord::Migration[6.0]
  def change
    add_column :steps, :description_text_field, :text
  end
end
