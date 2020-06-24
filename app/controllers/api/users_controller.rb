class Api::UsersController < Api::ApplicationController
  respond_to :json

  def index
    render json: User.all
  end

  def show
    #todo add user policies
    render json: User.find(params[:id])
  end

  def profile
    render json: current_user
  end

  #TO BE REMOVED BELOW WHEN POLICY IS DONE
  def skip_pundit?
    true
  end
end
