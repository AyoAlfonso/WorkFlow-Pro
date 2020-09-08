module StatsHelper

  def calculate_stats_for_week(current_user)
    previous_week_end = current_user.time_in_user_timezone.beginning_of_week
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