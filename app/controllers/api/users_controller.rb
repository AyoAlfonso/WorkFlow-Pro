class Api::UsersController < Api::ApplicationController
  respond_to :json

  def index
    render json: User.all
  end
end
