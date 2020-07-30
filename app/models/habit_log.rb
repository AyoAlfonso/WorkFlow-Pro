# A habit-log represents a habit that has been completed for a date
class HabitLog < ApplicationRecord
  belongs_to :habit
  scope :complete_weekly_logs, -> {
    where("log_date >= ?", Date.current_week_start).
    where("log_date <= ?", Date.current_week_end)
  }

  def as_json
    super(except: [:created_at, :updated_at])
  end
end
