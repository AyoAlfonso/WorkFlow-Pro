class AddOrderIndexCheckInTemplateIdToCheckInTemplateSteps < ActiveRecord::Migration[6.1]
  def change
    add_index :check_in_templates_steps, [:order_index, :check_in_template_id], name: "order_index_check_in_template_id_index" , unique: true
    change_column :check_in_templates_steps, :created_at, :datetime, null: false, default: -> { "CURRENT_TIMESTAMP" }
    change_column :check_in_templates_steps, :updated_at, :datetime, null: false, default: -> { "CURRENT_TIMESTAMP" }
  end
end