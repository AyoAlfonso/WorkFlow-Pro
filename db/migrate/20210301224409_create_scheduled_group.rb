class CreateScheduledGroup < ActiveRecord::Migration[6.0]
  def change
    create_table :scheduled_groups do |t|
      t.string :name
      t.timestamps
    end
  end
end