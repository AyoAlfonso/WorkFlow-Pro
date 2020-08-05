class Api::UsersController < Api::ApplicationController
  helper ApplicationHelper
  before_action :set_user, only: [:show, :update]
  before_action :skip_authorization, only: :profile
  respond_to :json

  def index
    @users = policy_scope(User)
    render '/api/users/index'
  end

  def create
    #generate a random password
    @user = current_user.company.users.create(user_creation_params)
    render '/api/users/show'
  end

  def show
    render '/api/users/show'
  end

  def profile
    @user = current_user
    @static_data = view_context.static_data
    render '/api/users/profile'
  end

  def update
    @user.update!(user_update_params)
    render 'api/users/show'
  end

  def update_avatar
    authorize current_user
    current_user.avatar.attach(params[:avatar])
    render json: { avatar_url: current_user.avatar_url }
  end

  def delete_avatar
    authorize current_user
    current_user.avatar.purge_later
    render json: { avatar_url: nil }
  end

  private

  def user_creation_params
    params.permit(:first_name, :last_name, :email, :timezone, :user_role_id)
  end

  def user_update_params
    params.require(:user).permit(:id, :first_name, :last_name, :email, daily_logs_attributes: [:id, :work_status])
  end

  def set_user
    @user = User.find(params[:id])
    authorize @user
  end
end
