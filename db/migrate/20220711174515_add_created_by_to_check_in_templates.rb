class AddCreatedByToCheckInTemplates < ActiveRecord::Migration[6.1]
  def change
    add_reference :check_in_templates, :created_by, references: :user, null:true
  end
end
