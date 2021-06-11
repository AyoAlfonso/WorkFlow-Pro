class CreateVScoredcards < ActiveRecord::Migration[6.0]
  def change
    create_view :v_scoredcards
  end
end
