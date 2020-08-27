class Api::TeamsController < Api::ApplicationController
  respond_to :json
  before_action :set_team, only: [:show]
  after_action :verify_policy_scoped, only: [:index, :user_teams], unless: :skip_pundit?

  def index
    @teams = policy_scope(Team).all
    render 'api/teams/index'
  end

  def show
    one_week_ago_timezone = (current_user.time_in_user_timezone.to_date) - 1.week
    one_day_ago_timezone = (current_user.time_in_user_timezone.to_date) - 1.day
    @average_weekly_user_emotions = @team.weekly_average_users_emotion_score(one_week_ago_timezone, one_day_ago_timezone)
    @average_team_emotion_score = @team.team_average_weekly_emotion_score(one_week_ago_timezone, one_day_ago_timezone)
    render 'api/teams/show'
  end

  private
  def set_team
    @team = policy_scope(Team).find(params[:id])
    authorize @team
  end

end
