class Habit < ApplicationRecord
  include StatsHelper

  belongs_to :user
  has_many :habit_logs, dependent: :destroy

  scope :owned_by_user, -> (user) { where(user: user) }
  delegate  :complete_current_week_logs,
            :complete_previous_week_logs,
            :completed_logs_by_date_range,
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
    current_week_completion_count = self.completed_logs_by_date_range(current_week_start, current_week_end).count
    previous_week_completion_count = self.completed_logs_by_date_range(previous_week_start, previous_week_end).count
    difference_between_values(current_week_completion_count, previous_week_completion_count)
  end

  def weekly_completion_percentage_by_date_range(start_date, end_date)
    completed_logs_count = get_previous_week_completion(start_date, end_date).count
    (completed_logs_count.to_f / self.frequency.to_f) * 100
  end

  def weekly_completion_fraction_by_date_range(start_date, end_date)
    completed_logs_count = get_previous_week_completion(start_date, end_date).count
    "#{completed_logs_count}/#{self.frequency}"
  end

  def weekly_difference_for_the_previous_week
    current_week_completed_log_percentage = weekly_completion_percentage_by_date_range(current_week_start, current_week_end)
    previous_week_completed_log_percentage = weekly_completion_percentage_by_date_range(previous_week_start, previous_week_end)
    current_week_completed_log_percentage - previous_week_completed_log_percentage
  end

  private
  def get_previous_week_completion(start_date, end_date)
    self.completed_logs_by_date_range(start_date, end_date)
  end

  def current_week_start
    get_beginning_of_last_or_current_work_week_date(self.user.time_in_user_timezone)
  end

  def current_week_end
    self.user.time_in_user_timezone.end_of_week
  end

  def previous_week_start
    current_week_start.weeks_ago(1)
  end

  def previous_week_end
    previous_week_start.end_of_week
  end
end
