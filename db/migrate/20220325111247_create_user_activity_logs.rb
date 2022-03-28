class CreateUserActivityLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :user_activity_logs do |t|
      t.string "user_id"
      t.string "browser"
      t.string "ip_address"
      t.string "location"
      t.string "controller"
      t.string "action"
      t.string "params"
      t.string "company_id"
      t.string "team_id"
      t.string "note"
      t.timestamps
    end
  end
end
