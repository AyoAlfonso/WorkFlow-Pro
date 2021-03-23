class CreateUserPulse < ActiveRecord::Migration[6.0]
  def change
    create_table :user_pulses do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :score
      t.string :feeling, default: ""
      t.string :completed_at
      t.timestamps
    end
  end
end
