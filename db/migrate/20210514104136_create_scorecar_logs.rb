class CreateScorecardLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :scorecard_logs do |t|

      belongs_to :key_performance_indicators 
      t.associated_kpi :description
      t.score :interger
      t.note :string

      t.timestamps
    end
  end
end
