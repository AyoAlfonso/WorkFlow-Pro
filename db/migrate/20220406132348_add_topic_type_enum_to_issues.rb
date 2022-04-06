class AddTopicTypeEnumToIssues < ActiveRecord::Migration[6.1]
  def change
    add_column :issues, :topic_type, :integer
  end
end
