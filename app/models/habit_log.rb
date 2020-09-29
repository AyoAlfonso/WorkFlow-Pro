# A habit-log represents a habit that has been completed for a date
class HabitLog < ApplicationRecord
  belongs_to :habit

  scope :completed_logs_by_date_range, -> (start_date, end_date) {
    where("log_date >= ? AND log_date <= ?", start_date, end_date)
  }

  def as_json
    super(except: [:created_at, :updated_at])
  end

end
