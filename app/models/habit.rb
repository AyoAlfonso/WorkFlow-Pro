class Habit < ApplicationRecord
  belongs_to :user
  has_many :habit_logs

  scope :owned_by_user, -> (user) { where(user: user) }
  delegate :complete_weekly_logs, to: :habit_logs

  def as_json(options = [])
    super({
      except: [:created_at, :updated_at],
      include: [weekly_logs: {
                  except: [:created_at, :updated_at]
                }]
    })
  end

  # Builds weekly log objects for days of the week that don't have log
  def weekly_logs
    (0..6).map do |day_int|
      complete_weekly_logs.find { |wl| wl.log_date.wday == day_int} ||
      HabitLog.new(
        habit: self,
        log_date: Date.current_week_start.next_day(day_int)
      )
    end
  end
end
