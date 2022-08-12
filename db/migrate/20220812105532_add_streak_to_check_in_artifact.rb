class AddStreakToCheckInArtifact < ActiveRecord::Migration[6.1]
  def change
    add_column :check_in_artifacts, :streak, :integer, default: 0
  end
end
