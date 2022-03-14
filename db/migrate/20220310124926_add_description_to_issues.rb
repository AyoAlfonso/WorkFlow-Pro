class AddDescriptionToIssues < ActiveRecord::Migration[6.1]
  def change
    add_column :issues, :body, :string
  end
end
