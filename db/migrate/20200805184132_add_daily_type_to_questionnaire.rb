class AddDailyTypeToQuestionnaire < ActiveRecord::Migration[6.0]
  def change
    add_column :questionnaires, :daily_limit, :boolean
  end
end
