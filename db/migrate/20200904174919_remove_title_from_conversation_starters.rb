class RemoveTitleFromConversationStarters < ActiveRecord::Migration[6.0]
  def change
    remove_column :conversation_starters, :title, :string
  end
end
