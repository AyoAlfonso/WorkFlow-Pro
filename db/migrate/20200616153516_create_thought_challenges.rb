class CreateThoughtChallenges < ActiveRecord::Migration[6.0]
  def change
    create_table :thought_challenges do |t|
      t.text :negative_thoughts
      t.column :cognitive_distortions, :integer, default: 0
      t.text :how_to_challenge_negative_thoughts
      t.text :another_way_to_interpret

      t.timestamps
    end
  end
end
