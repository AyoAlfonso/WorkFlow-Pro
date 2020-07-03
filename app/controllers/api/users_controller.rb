class Api::UsersController < Api::ApplicationController
  before_action :set_user, only: [:show, :update]
  before_action :skip_authorization, only: :profile
  respond_to :json

  def index
    @users = policy_scope(User).all
    render json: @users
  end

  def show
    render json: @user
  end

  def profile
    render json: current_user.serializable_hash(methods: [:avatar_url])
  end

  private

  def set_user
    @user = User.find(params[:id])
    authorize @user
  end
end
