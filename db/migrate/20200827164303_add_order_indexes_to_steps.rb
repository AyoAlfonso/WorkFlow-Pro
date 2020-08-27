class AddOrderIndexesToSteps < ActiveRecord::Migration[6.0]
  def change
    add_index(:steps, [:meeting_template_id, :order_index])
    add_index(:steps, :order_index)
  end
end
