module StatsHelper
  
  def milestone_progress(current_user)
    current_quarter = current_user.company.current_fiscal_quarter
    #TODO: NEED TO ADD THE CURRENT YEAR HERE
    #milestones for this week and in team
    completed_milestones = Milestone.for_user_on_quarter(current_user, current_quarter).completed.count
    total_milestones = Milestone.for_user_on_quarter(current_user, current_quarter).count
    if total_milestones == 0
      0
    else
      completed_milestones / total_milestones * 100
    end
  end

  def get_beginning_of_last_or_current_work_week_date(current_time)
    if [0,5,6].include? (current_time.wday)
      current_time.beginning_of_week
    else
      current_time.beginning_of_week.weeks_ago(1)
    end
  end

  def daily_average_users_emotion_scores_over_last_week(current_user)
    previous_week_end = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    previous_week_start = previous_week_end.weeks_ago(1)
    current_user.daily_average_users_emotion_scores_over_week(previous_week_start, previous_week_end)
  end

  def average_weekly_emotion_score_over_last_week(current_user)
    previous_week_end = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    previous_week_start = previous_week_end.weeks_ago(1)
    current_user.team_average_weekly_emotion_score(previous_week_start, previous_week_end)
  end

  def average_weekly_emotion_score_over_last_week_previous_week(current_user)
    previous_week_end = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone).weeks_ago(1)
    previous_week_start = previous_week_end.weeks_ago(1)
    current_user.team_average_weekly_emotion_score(previous_week_start, previous_week_end)
  end

  def average_weekly_emotion_score_difference(current_user)
    average_weekly_emotion_score_over_last_week(current_user) - average_weekly_emotion_score_over_last_week_previous_week(current_user)
  end

  def habits_for_the_previous_week(current_user)
    beginning_of_last_week = Date.today.prev_week
    end_of_last_week = beginning_of_last_week + 6.days
    habits = current_user.habits.map do |habit|
      {
        habit: habit,
        weekly_completion_percentage: habit.weekly_completion_percentage_by_date_range(beginning_of_last_week, end_of_last_week),
        weekly_difference: habit.weekly_difference_for_the_previous_week,
        weekly_completion_fraction: habit.weekly_completion_fraction_by_date_range(beginning_of_last_week, end_of_last_week)
      }
    end
    habits
  end

  def calculate_stats_for_week(current_user)
    previous_week_end = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    previous_week_start = previous_week_end.weeks_ago(1)
    previous_2_week_start = previous_week_end.weeks_ago(2)
    ka_created_last_week = KeyActivity.user_created_between(current_user, previous_week_start, previous_week_end).count
    ka_created_2_weeks = KeyActivity.user_created_between(current_user, previous_2_week_start, previous_week_start).count
    ka_created_change = ka_created_2_weeks != 0 ? (ka_created_last_week / ka_created_2_weeks)*100 : 0
    ka_completed_last_week = KeyActivity.user_completed_between(current_user, previous_week_start, previous_week_end).count
    ka_completed_2_weeks = KeyActivity.user_completed_between(current_user, previous_2_week_start, previous_week_start).count
    ka_completed_change = ka_completed_2_weeks != 0 ? (ka_completed_last_week / ka_completed_2_weeks)*100 : 0
    issues_created_last_week = Issue.user_created_between(current_user, previous_week_start, previous_week_end).count
    issues_created_2_weeks = Issue.user_created_between(current_user, previous_2_week_start, previous_week_start).count
    issues_created_change = issues_created_2_weeks != 0 ? (issues_created_last_week / issues_created_2_weeks)*100 : 0

    [
      {
        statistic_name: "#{I18n.t('key_activities')} Created",
        statistic_number: ka_created_last_week,
        statistic_change: ka_created_change,
      }, 
      {
        statistic_name: "#{I18n.t('key_activities')} Completed",
        statistic_number: ka_completed_last_week,
        statistic_change: ka_completed_change
      },
      {
        statistic_name: "#{I18n.t('issues')} Created",
        statistic_number: issues_created_last_week,
        statistic_change: issues_created_change
      }
    ]
  end

end