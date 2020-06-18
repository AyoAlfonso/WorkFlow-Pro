class Api::UsersController < Api::ApplicationController
  respond_to :json

  def index
    render json: Issues.all
  end
end
