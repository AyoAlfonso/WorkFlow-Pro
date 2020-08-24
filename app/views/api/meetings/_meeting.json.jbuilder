json.extract! meeting, :id, :name, :duration, :meeting_type, :average_rating, :issues_done, :key_activities_done, :average_team_mood, :goal_progress, :team_id, :created_at, :start_time, :end_time, :current_step, :host_name, :scheduled_start_time
json.steps meeting.steps, partial: 'api/steps/step', as: :step
