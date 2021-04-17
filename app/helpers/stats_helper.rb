module StatsHelper


  def weekly_milestone_progress(user)
    milestones = Milestone.current_week_for_user(get_beginning_of_last_or_current_work_week_date(user.time_in_user_timezone), user, "QuarterlyGoal")
    completed_milestone_scores = milestones.map do |m|
      if m[:status] == "completed"
        1
      elsif m[:status] == "in_progress"
        0.5
      else
        0
      end
    end
    average_completed_milestone_scores = completed_milestone_scores.length == 0 ? 0 : completed_milestone_scores.sum.to_f / completed_milestone_scores.length
  end
  
  def quarterly_milestone_progress(current_user)
    current_quarter = current_company.current_fiscal_quarter
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
    if [1].include? (current_time.wday)
      current_time.beginning_of_week.weeks_ago(1)
    else
      current_time.beginning_of_week
    end
  end

  def get_next_week_or_current_week_date(current_time)
    if [1].include? (current_time.wday)
      current_time.beginning_of_week
    else
      current_time.beginning_of_week.next_week
    end
  end

  def get_beginning_of_current_month(current_time)
    current_time.beginning_of_month
  end

  def get_beginning_of_last_month(current_time)
    current_time.last_month.beginning_of_month
  end

  def daily_average_users_emotion_scores_over_last_week(current_user)
    previous_week_start = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    previous_week_end = previous_week_start + 6.days
    current_user.daily_average_users_emotion_scores_over_week(previous_week_start, previous_week_end)
  end

  def daily_average_users_emotion_scores_over_last_month(current_user)
    previous_month_start = get_beginning_of_last_month(current_user.time_in_user_timezone)
    previous_month_end = current_user.time_in_user_timezone.last_month.end_of_month
    current_user.daily_average_users_emotion_scores_over_month(previous_month_start, previous_month_end)
  end

  def average_weekly_emotion_score_over_last_week(current_user)
    previous_week_start = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    previous_week_end = previous_week_start + 6.days
    current_user.team_average_weekly_emotion_score(previous_week_start, previous_week_end)
  end

  def average_weekly_emotion_score_over_last_week_previous_week(current_user)
    previous_week_start = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone).weeks_ago(1)
    previous_week_end = previous_week_start + 6.days
    current_user.team_average_weekly_emotion_score(previous_week_start, previous_week_end)
  end

  def average_weekly_emotion_score_difference(current_user)
    average_weekly_emotion_score_over_last_week(current_user) - average_weekly_emotion_score_over_last_week_previous_week(current_user)
  end

  def average_monthly_emotion_score_over_last_month(current_user)
    previous_month_start = get_beginning_of_last_month(current_user.time_in_user_timezone)
    previous_month_end = current_user.time_in_user_timezone.last_month.end_of_month
    current_user.team_average_monthly_emotion_score(previous_month_start, previous_month_end)
  end

  def average_monthly_emotion_score_over_last_month_previous_month(current_user)
    previous_month_start = get_beginning_of_last_month(current_user.time_in_user_timezone).months_ago(1)
    previous_month_end = current_user.time_in_user_timezone.last_month.end_of_month
    current_user.team_average_monthly_emotion_score
  end

  def average_monthly_emotion_score_difference(current_user)
    average_monthly_emotion_score_over_last_month(current_user) - average_monthly_emotion_score_over_last_month_previous_month(current_user)
  end

  def habits_for_the_previous_week(current_user)
    beginning_of_last_week = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
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
    current_week_start = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    current_week_end = current_user.time_in_user_timezone

    previous_week_start = current_week_start.weeks_ago(1)
    previous_week_end = previous_week_start.end_of_week

    ka_created_this_week = KeyActivity.optimized.user_created_between(current_user, current_week_start, current_week_end).count
    ka_created_last_week = KeyActivity.optimized.user_created_between(current_user, previous_week_start, previous_week_end).count

    ka_created_change = difference_between_values(ka_created_this_week, ka_created_last_week)

    ka_completed_this_week = KeyActivity.optimized.user_completed_between(current_user, current_week_start, current_week_end).count
    ka_completed_last_week = KeyActivity.optimized.user_completed_between(current_user, previous_week_start, previous_week_end).count
    ka_completed_change = difference_between_values(ka_completed_this_week, ka_completed_last_week)

    issues_created_this_week = Issue.optimized.user_created_between(current_user, current_week_start, current_week_end).count
    issues_created_last_week = Issue.optimized.user_created_between(current_user, previous_week_start, previous_week_end).count
    issues_created_change = difference_between_values(issues_created_this_week, issues_created_last_week)

    [
      {
        statistic_name: "#{I18n.t('key_activities_created')}",
        statistic_number: ka_created_this_week,
        statistic_change: ka_created_change,
      }, 
      {
        statistic_name: "#{I18n.t('key_activities_completed')}",
        statistic_number: ka_completed_this_week,
        statistic_change: ka_completed_change
      },
      {
        statistic_name: "#{I18n.t('issues_addressed')}",
        statistic_number: issues_created_this_week,
        statistic_change: issues_created_change
      }
    ]
  end

  def calculate_stats_for_month(current_user)
    current_month_start = get_beginning_of_current_month(current_user.time_in_user_timezone)
    current_month_end = current_user.time_in_user_timezone

    previous_month_start = current_month_start.months_ago(1)
    previous_month_end = previous_month_start.end_of_month

    ka_created_this_month = KeyActivity.optimized.user_created_between(current_user, current_month_start, current_month_end).count
    ka_created_last_month = KeyActivity.optimized.user_created_between(current_user, previous_month_start, previous_month_end).count

    ka_created_change = difference_between_values(ka_created_this_month, ka_created_last_month)

    ka_completed_this_month = KeyActivity.optimized.user_completed_between(current_user, current_month_start, current_month_end).count
    ka_completed_last_month = KeyActivity.optimized.user_completed_between(current_user, previous_month_start, previous_month_end).count
    ka_completed_change = difference_between_values(ka_completed_this_month, ka_completed_last_month)

    issues_created_this_month = Issue.optimized.user_created_between(current_user, current_month_start, current_month_end).count
    issues_created_last_month = Issue.optimized.user_created_between(current_user, previous_month_start, previous_month_end).count
    issues_created_change = difference_between_values(issues_created_this_month, issues_created_last_month)

    [
      {
        statistic_name: "#{I18n.t('key_activities_created')}",
        statistic_number: ka_created_this_month,
        statistic_change: ka_created_change,
      }, 
      {
        statistic_name: "#{I18n.t('key_activities_completed')}",
        statistic_number: ka_completed_this_month,
        statistic_change: ka_completed_change
      },
      {
        statistic_name: "#{I18n.t('issues_addressed')}",
        statistic_number: issues_created_this_month,
        statistic_change: issues_created_change
      }
    ]
  end

  def difference_between_values(current_value, previous_value)
    if current_value >= previous_value
      difference = previous_value == 0 ? 
                    current_value * 100 : 
                    ((current_value - previous_value).to_f / previous_value.to_f) * 100
    else
      difference = current_value == 0 ? 
                    -previous_value * 100 : 
                    ((current_value - previous_value).to_f / previous_value.to_f) * 100
    end
  end

end