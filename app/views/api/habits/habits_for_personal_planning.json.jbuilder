json.array! @habits do |habit|
  json.partial! habit, partial: 'api/habits/habit', as: :habit
  json.weekly_completion_percentage habit.weekly_completion_percentage_by_date_range(@beginning_of_last_week, @end_of_last_week)
  json.weekly_difference habit.weekly_difference_for_the_previous_week
  json.weekly_completion_fraction habit.weekly_completion_fraction_by_date_range(@beginning_of_last_week, @end_of_last_week)
end