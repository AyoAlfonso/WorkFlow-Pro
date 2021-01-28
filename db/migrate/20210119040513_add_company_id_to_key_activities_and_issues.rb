class AddCompanyIdToKeyActivitiesAndIssues < ActiveRecord::Migration[6.0]
  def change
    add_reference :key_activities, :company, foreign_key: true
    add_reference :issues, :company, foreign_key: true
  end
end
