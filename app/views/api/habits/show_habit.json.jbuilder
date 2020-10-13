json.partial! @habit, partial: 'api/habits/habit', as: :habit
json.score @habit.score
json.monthly_score_difference @habit.monthly_score_difference
json.weekly_score_difference @habit.weekly_score_difference
json.score_data_for_line_graph @habit.score_data_for_line_graph
json.frequency_data_for_bar_graph @habit.frequency_data_for_bar_graph