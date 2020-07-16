class AddContextDescriptionToAnnualInitiative < ActiveRecord::Migration[6.0]
  def change
    add_column :annual_initiatives, :context_description, :string
  end
end
