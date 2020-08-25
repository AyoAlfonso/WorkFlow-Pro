class Api::TeamsController < Api::ApplicationController
  respond_to :json
  after_action :verify_policy_scoped, only: [:index, :user_teams], unless: :skip_pundit?

  def index
    @teams = policy_scope(Team).all
    render 'api/teams/index'
  end

end
