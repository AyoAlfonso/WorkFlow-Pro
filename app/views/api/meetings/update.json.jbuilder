json.partial! @meeting, partial: 'api/meetings/meeting', as: :meeting
json.current_week_average_user_emotions @current_week_average_user_emotions
json.current_week_average_team_emotions @current_week_average_team_emotions
json.emotion_score_percentage_difference @emotion_score_percentage_difference
json.stats_for_week @stats_for_week
json.my_current_milestones @my_current_milestones, partial: 'api/meetings/milestone', as: :milestone
json.habits_percentage_increase_from_previous_week @habits_percentage_increase_from_previous_week