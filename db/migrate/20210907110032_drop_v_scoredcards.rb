class DropVScoredcards < ActiveRecord::Migration[6.0]
  def change
     drop_view :v_scoredcards
  end
end
