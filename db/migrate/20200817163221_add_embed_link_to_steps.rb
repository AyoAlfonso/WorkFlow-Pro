class AddEmbedLinkToSteps < ActiveRecord::Migration[6.0]
  def change
    add_column :steps, :link_embed, :text
  end
end
