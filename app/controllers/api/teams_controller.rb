class Api::TeamsController < Api::ApplicationController
  respond_to :json

  def index
    @teams = policy_scope(Team)
    render 'api/teams/index'
  end

end
