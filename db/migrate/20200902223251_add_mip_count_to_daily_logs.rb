class AddMipCountToDailyLogs < ActiveRecord::Migration[6.0]
  def change
    add_column :daily_logs, :mip_count, :integer
  end
end
