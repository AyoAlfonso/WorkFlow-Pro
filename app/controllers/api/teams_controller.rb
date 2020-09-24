class Api::TeamsController < Api::ApplicationController
  include StatsHelper

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
    previous_week_start = get_beginning_of_last_or_current_work_week_date(current_user.time_in_user_timezone)
    previous_week_end = previous_week_start + 6.days
    @average_weekly_user_emotions = @team.daily_average_users_emotion_scores_over_week(previous_week_start, previous_week_end)
    @average_team_emotion_score = @team.team_average_weekly_emotion_score(previous_week_start, previous_week_end)
  end

  def set_team
    @team = policy_scope(Team).find(params[:id])
    authorize @team
  end

  def team_settings_params
    params.require(:team).permit(:id, settings: [:weekly_meeting_dashboard_link_embed])
  end

end
