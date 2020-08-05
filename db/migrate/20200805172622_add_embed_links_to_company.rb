class AddEmbedLinksToCompany < ActiveRecord::Migration[6.0]
  def change
    add_column :companies, :accountability_chart_embed, :text
    add_column :companies, :strategic_plan_embed, :text
  end
end
