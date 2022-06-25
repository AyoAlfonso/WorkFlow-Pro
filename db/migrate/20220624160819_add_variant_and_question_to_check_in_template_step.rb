class AddVariantAndQuestionToCheckInTemplateStep < ActiveRecord::Migration[6.1]
  def change
    add_column :check_in_templates_steps, :variant, :string
    add_column :check_in_templates_steps, :question, :string
  end
end
