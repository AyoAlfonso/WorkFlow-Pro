class CreateTeamLeads < ActiveRecord::Migration[6.0]
  def change
    create_table :team_leads do |t|
      t.references :user, null: false, foreign_key: true
      t.references :team, null: false, foreign_key: true

      t.timestamps
    end
  end
end