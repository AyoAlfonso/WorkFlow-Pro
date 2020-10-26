class Habit < ApplicationRecord
  include StatsHelper

  belongs_to :user
  has_many :habit_logs, dependent: :destroy

  scope :owned_by_user, -> (user) { where(user: user) }
  delegate  :completed_logs_by_date_range, to: :habit_logs

  def as_json(options = [])
    super({
      methods: [:score, :monthly_score_difference, :weekly_score_difference],
      except: [:created_at, :updated_at],
      include: [
                current_week_logs: {
                  except: [:created_at, :updated_at]
                },
              ]
    })
  end

  # Builds weekly log objects for days of the week that don't have log
  def current_week_logs
    (0..4).map do |index|
      date = (self.user.convert_to_their_timezone - index.days).to_date
      self.habit_logs.find { |wl| wl.log_date == date} ||
        HabitLog.new(
          habit: self,
          log_date: date
        )
    end
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

  def score_data_for_line_graph
    #show each week up to today.
    weekly_score_results = week_start_date_records.map do |date|
      calculate_score_for_date_range(date, date + 6.days)
    end

    #show last 6 months.
    monthly_score_results = first_day_of_last_6_months.map do |date|
      calculate_score_for_date_range(date, date.end_of_month)
    end
  
    # show each quarter (4)
    next_fiscal_start_date = habit_user_company.next_fiscal_start_date

    quarterly_score_results = (0..3).map do |number|
      first_day_of_quarter = next_fiscal_start_date - ((number + 1) * 13.weeks)
      last_day_of_quarter = next_fiscal_start_date - 1.day - (number * 13.weeks)
      calculate_score_for_date_range(first_day_of_quarter, last_day_of_quarter)
    end

    {
      weekly_stats:{
        label: "weekly",
        data: weekly_score_results.reverse,
        labels: weekly_chart_labels.reverse
      },
      monthly_stats: {
        label: "monthly",
        data: monthly_score_results.reverse,
        labels: monthly_chart_labels.reverse
      },
      quarterly_stats: {
        label: "quarterly",
        data: quarterly_score_results.reverse, 
        labels: quarterly_chart_labels
      }
    }

  end

  def frequency_data_for_bar_graph
    weekly_frequency_results = week_start_date_records.map do |date|
      self.habit_logs.where("log_date >= ? AND log_date <= ?", date, date + 6.days).count
    end

    #show last 6 months.
    monthly_frequency_results = first_day_of_last_6_months.map do |date|
      self.habit_logs.where("log_date >= ? AND log_date <= ?", date, date.end_of_month).count
    end
  
    # show each quarter (4)
    next_fiscal_start_date = habit_user_company.next_fiscal_start_date

    quarterly_frequency_results = (0..3).map do |number|
      first_day_of_quarter = next_fiscal_start_date - ((number + 1) * 13.weeks)
      last_day_of_quarter = next_fiscal_start_date - 1.day - (number * 13.weeks)
      self.habit_logs.where("log_date >= ? AND log_date <= ?", first_day_of_quarter, last_day_of_quarter).count
    end

    {
      weekly_stats:{
        label: "weekly",
        data: weekly_frequency_results.reverse,
        labels: weekly_chart_labels.reverse
      },
      monthly_stats: {
        label: "monthly",
        data: monthly_frequency_results.reverse,
        labels: monthly_chart_labels.reverse
      },
      quarterly_stats: {
        label: "quarterly",
        data: quarterly_frequency_results.reverse, 
        labels: quarterly_chart_labels
      }
    }
  end

  private
  def get_previous_week_completion(start_date, end_date)
    self.completed_logs_by_date_range(start_date, end_date)
  end

  def current_week_start_date
    self.user.time_in_user_timezone.beginning_of_week
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
    weekly_average_from_past_4_weeks = self.habit_logs.where("log_date >= ?", date - 4.weeks).count.to_f / 4
    aggregate_from_past_256_days_count = self.habit_logs.where("log_date >= ?", date - 256.days).count
    parhams_equation_for_score(weekly_average_from_past_4_weeks, self.frequency, aggregate_from_past_256_days_count)
  end

  def calculate_score_for_date_range(start_date, end_date)
    weekly_average_from_date_range = self.habit_logs.where("log_date >= ? AND log_date <= ?", start_date, end_date).count.to_f / 4
    aggregate_from_past_256_days_count = self.habit_logs.where("log_date >= ?", end_date - 256.days).count
    parhams_equation_for_score(weekly_average_from_date_range, self.frequency, aggregate_from_past_256_days_count)
  end

  def parhams_equation_for_score(weekly_average, weekly_goal, aggregate_from_past_256_days_count)
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
    average_target = 66
    aggregate_value = aggregate_from_past_256_days_count < 66 ? aggregate_from_past_256_days_count : 66
    (((Math.log((weekly_average.to_f / weekly_goal.to_f) + 1) / Math.log(2)) * (aggregate_value.to_f / average_target.to_f)) * 100).round(2)
  end

  def week_start_date_records
    (0..7).map do |number|
      current_week_start_date - number.weeks
    end
  end

  def weekly_chart_labels
    week_start_date_records.map do |date|
      date.strftime("%m/%d")
    end
  end

  def first_day_of_last_6_months
    (0..5).map do |number|
      user_current_date.beginning_of_month - number.months
    end
  end

  def monthly_chart_labels 
    first_day_of_last_6_months.map do |date|
      date.strftime("%b")
    end
  end

  def quarterly_chart_labels
    company = habit_user_company
    current_fiscal_quarter = company.current_fiscal_quarter
    current_fiscal_year = company.current_year_fiscal_year_start.year
    next_fiscal_start_date = company.next_fiscal_start_date
    
    quarterly_score_labels = case current_fiscal_quarter
                          when 1
                            ["#{current_fiscal_year-1} Q2", "#{current_fiscal_year-1} Q3", "#{current_fiscal_year-1} Q4", "#{current_fiscal_year} Q1"]
                          when 2
                            ["#{current_fiscal_year-1} Q3", "#{current_fiscal_year-1} Q4", "#{current_fiscal_year} Q1", "#{current_fiscal_year} Q2"]
                          when 3
                            ["#{current_fiscal_year-1} Q4", "#{current_fiscal_year} Q1", "#{current_fiscal_year} Q2", "#{current_fiscal_year} Q3"]
                          else
                            ["#{current_fiscal_year} Q1", "#{current_fiscal_year} Q2", "#{current_fiscal_year} Q3", "#{current_fiscal_year} Q4"]
                          end
  end

  def habit_user_company
    self.user.company
  end



end
