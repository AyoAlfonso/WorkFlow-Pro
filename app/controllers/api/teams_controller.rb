class Api::TeamsController < Api::ApplicationController
  respond_to :json

  def index
    @teams = policy_scope(Team).for_company(current_user.company)
    render 'api/teams/index'
  end

  def user_teams
    @teams = Team.for_user(current_user)
    authorize @teams
    render 'api/teams/user_teams'
  end

end
