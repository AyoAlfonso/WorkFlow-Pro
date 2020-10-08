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
      methods: [:score, :monthly_score_difference, :weekly_score_difference],
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
        log_date: current_week_start_date.next_day(day_int)
      )
    end
  end

  def complete_current_week_logs
    completed_logs_by_date_range(current_week_start_date, current_week_end_date)
  end

  def previous_week_logs
    (0..6).map do |day_int|
      complete_previous_week_logs.find { |wl| wl.log_date.wday == day_int} ||
      HabitLog.new(
        habit: self,
        log_date: previous_week_start_date.next_day(day_int)
      )
    end
  end

  def complete_previous_week_logs
    completed_logs_by_date_range(previous_week_start_date, previous_week_end_date)
  end

  def weekly_logs_completion_difference
    current_week_completion_count = self.completed_logs_by_date_range(current_week_start_date, current_week_end_date).count
    previous_week_completion_count = self.completed_logs_by_date_range(previous_week_start_date, previous_week_end_date).count
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
    current_week_completed_log_percentage = weekly_completion_percentage_by_date_range(current_week_start_date, current_week_end_date)
    previous_week_completed_log_percentage = weekly_completion_percentage_by_date_range(previous_week_start_date, previous_week_end_date)
    current_week_completed_log_percentage - previous_week_completed_log_percentage
  end

  def score
    calculate_score_for_date(user_current_date)
  end

  def monthly_score_difference
    previous_month_date = user_current_date.prev_month
    difference_between_values(calculate_score_for_date(user_current_date), calculate_score_for_date(previous_month_date))
  end

  def weekly_score_difference
    previous_week_date = user_current_date.prev_week
    difference_between_values(calculate_score_for_date(user_current_date), calculate_score_for_date(previous_week_date))
  end

  private
  def get_previous_week_completion(start_date, end_date)
    self.completed_logs_by_date_range(start_date, end_date)
  end

  def current_week_start_date
    get_beginning_of_last_or_current_work_week_date(self.user.time_in_user_timezone).prev_day.to_date
  end

  def current_week_end_date
    user_current_date.end_of_week.prev_day.to_date
  end

  def previous_week_start_date
    current_week_start_date.weeks_ago(1).to_date
  end

  def previous_week_end_date
    current_week_end_date.weeks_ago(1).to_date
  end

  def user_current_date
    self.user.time_in_user_timezone
  end

  def calculate_score_for_date(date)
    #PARHAM'S EQUATION
    # w ~ Weekly average from the past 4 weeks
    # g ~ Weekly goal/target
    # a ~ Aggregate from the past 256 days (set to 66 if above 66)
    # t ~ Avg target for building a habit (66)

    # Habit Score = Frequency x Stability
    # ---
    # Frequency = log(w/g + 1) / log(2)
    # Stability = a/t
    # Habit Score = (log(w/g + 1) / log(2)) x (a/t)

    weekly_average_from_past_4_weeks = self.habit_logs.where("log_date >= ?", date - 4.weeks).count.to_f / 4
    weekly_goal = self.frequency
    aggregate_from_past_256_days_count = self.habit_logs.where("log_date >= ?", date - 256.days).count
    aggregate_value = aggregate_from_past_256_days_count < 66 ? aggregate_from_past_256_days_count : 66
    average_target = 66
    ((Math.log((weekly_average_from_past_4_weeks.to_f / weekly_goal.to_f) + 1) / Math.log(2)) * (aggregate_value.to_f / average_target.to_f)) * 100
  end
end
