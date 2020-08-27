class Api::TeamsController < Api::ApplicationController
  respond_to :json
  before_action :set_team, only: [:show]
  after_action :verify_policy_scoped, only: [:index, :user_teams], unless: :skip_pundit?

  def index
    @teams = policy_scope(Team).all
    render 'api/teams/index'
  end

  def show
    @average_weekly_user_emotions = @team.weekly_average_users_emotion_score(1.week.ago, 1.day.ago)
    @average_team_emotion_score = @team.team_average_weekly_emotion_score(1.week.ago, 1.day.ago)
    render 'api/teams/show'
  end

  private
  def set_team
    @team = policy_scope(Team).find(params[:id])
    authorize @team
  end

end
