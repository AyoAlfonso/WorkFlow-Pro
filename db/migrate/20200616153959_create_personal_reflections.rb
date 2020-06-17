class CreatePersonalReflections < ActiveRecord::Migration[6.0]
  def change
    create_table :personal_reflections do |t|
      t.string :how_are_you_feeling
      t.text :what_do_you_feel
      t.text :reflect_and_celebrate
      t.text :daily_affirmations
      t.text :thoughts_and_reflections

      t.timestamps
    end
  end
end
