class AddTitleToQuestionnaires < ActiveRecord::Migration[6.0]
  def change
    add_column :questionnaires, :title, :string
  end
end
