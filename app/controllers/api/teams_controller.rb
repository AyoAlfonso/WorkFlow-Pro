class Api::TeamsController < Api::ApplicationController
  respond_to :json
  before_action :set_team, only: [:show, :update]
  after_action :verify_policy_scoped, only: [:index, :user_teams], unless: :skip_pundit?

  def index
    @teams = policy_scope(Team).all
    render 'api/teams/index'
  end

  def show
    fetch_additional_data
    render 'api/teams/show'
  end

  def update
    @team.update!(team_settings_params)
    fetch_additional_data
    render 'api/teams/show'
  end

  private
  def fetch_additional_data
    one_week_ago_timezone = (current_user.time_in_user_timezone.to_date) - 1.week
    one_day_ago_timezone = (current_user.time_in_user_timezone.to_date) - 1.day
    @average_weekly_user_emotions = @team.daily_average_users_emotion_scores_over_week(one_week_ago_timezone, one_day_ago_timezone)
    @average_team_emotion_score = @team.team_average_weekly_emotion_score(one_week_ago_timezone, one_day_ago_timezone)
  end

  def set_team
    @team = policy_scope(Team).find(params[:id])
    authorize @team
  end

  def team_settings_params
    params.require(:team).permit(:id, settings: [:weekly_meeting_dashboard_link_embed])
  end

end
