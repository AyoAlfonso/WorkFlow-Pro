class Api::TeamsController < Api::ApplicationController
  respond_to :json

  def index
    @teams = policy_scope(Team)
    render json: @teams
  end

end
