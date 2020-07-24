class Api::UsersController < Api::ApplicationController
  helper ApplicationHelper
  before_action :set_user, only: [:show, :update]
  before_action :skip_authorization, only: :profile
  respond_to :json

  def index
    @users = policy_scope(User)
    render json: @users
  end

  def show
    render json: @user
  end

  def profile
    render json: current_user.serializable_hash(methods: [:avatar_url, :role]).merge(static_data: view_context.static_data)
  end

  def update
    @user.update!(user_params)
    render json: @user
  end

  def update_avatar
    authorize current_user
    current_user.avatar.attach(params[:avatar])
    render json: { avatar_url: current_user.avatar_url }
  end

  private

  def user_params
    params.permit(:first_name, :last_name, :email) #, :timezone, :company_id, :user_role_id)
  end

  def set_user
    @user = User.find(params[:id])
    authorize @user
  end
end
