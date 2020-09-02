class Habit < ApplicationRecord
  belongs_to :user
  has_many :habit_logs, dependent: :destroy

  scope :owned_by_user, -> (user) { where(user: user) }
  delegate  :complete_current_week_logs,
            :complete_previous_week_logs,
            to: :habit_logs

  def as_json(options = [])
    super({
      methods: [:weekly_logs_completion_difference],
      except: [:created_at, :updated_at],
      include: [
                current_week_logs: {
                  except: [:created_at, :updated_at]
                },
                previous_week_logs: {
                  except: [:created_at, :updated_at]
                }
              ]
    })
  end

  # Builds weekly log objects for days of the week that don't have log
  def current_week_logs
    (0..Date.today.wday).map do |day_int|
      complete_current_week_logs.find { |wl| wl.log_date.wday == day_int} ||
      HabitLog.new(
        habit: self,
        log_date: Date.current_week_start.next_day(day_int)
      )
    end
  end

  def previous_week_logs
    (0..6).map do |day_int|
      complete_previous_week_logs.find { |wl| wl.log_date.wday == day_int} ||
      HabitLog.new(
        habit: self,
        log_date: Date.previous_week_start.next_day(day_int)
      )
    end
  end

  def weekly_logs_completion_difference
    current_week_completion_count = self.complete_current_week_logs.count
    previous_week_completion_count = self.complete_previous_week_logs.count
    
    if current_week_completion_count >= previous_week_completion_count
      difference = previous_week_completion_count == 0 ? 
                    current_week_completion_count * 100 : 
                    ((current_week_completion_count - previous_week_completion_count).to_f / previous_week_completion_count.to_f) * 100
    else
      difference = current_week_completion_count == 0 ? 
                    previous_week_completion_count * 100 : 
                    ((previous_week_completion_count - current_week_completion_count).to_f / current_week_completion_count.to_f) * 100
    end
  end
end
