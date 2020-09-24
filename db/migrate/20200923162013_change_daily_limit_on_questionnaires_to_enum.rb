class ChangeDailyLimitOnQuestionnairesToEnum < ActiveRecord::Migration[6.0]
  def change
    remove_column :questionnaires, :daily_limit
    add_column :questionnaires, :limit_type, :integer, default: 0
  end

  def data
    Questionnaire.all.each do |q|
      if q.name == "Create My Day" or q.name == "Evening Reflection"
        q.limit_type = 1
      elsif q.name == "Weekly Reflection"
        q.limit_type = 2
      end
      q.save!
    end
  end
end
