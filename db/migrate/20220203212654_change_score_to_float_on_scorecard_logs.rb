class ChangeScoreToFloatOnScorecardLogs < ActiveRecord::Migration[6.1]
  def change
    change_column :scorecard_logs, :score, :float
  end
end
