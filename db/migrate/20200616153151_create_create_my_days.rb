class CreateCreateMyDays < ActiveRecord::Migration[6.0]
  def change
    create_table :create_my_days do |t|
      t.text :i_am_grateful_for
      t.text :how_do_i_want_to_feel
      t.string :frog_type
      t.integer :frog_id
      t.text :daily_affirmation
      t.text :thoughts_and_reflections

      t.timestamps
    end
  end
end
