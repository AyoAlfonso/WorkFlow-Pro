class Api::UsersController < Api::ApplicationController
  helper ApplicationHelper
  before_action :set_user, only: [:show, :update, :resend_invitation]
  before_action :skip_authorization, only: :profile
  respond_to :json

  def index
    @users = policy_scope(User)
    render '/api/users/index'
  end

  def create
    authorize current_user.company.users.new
    if User.find_by_email(user_creation_params[:email]).present?
      render json: {message: "User already created."}, status: :unprocessable_entity
      return
    end

    @user = User.invite!(user_creation_params.merge(company_id: current_user.company.id))
    if @user.valid? && @user.persisted?
      render '/api/users/show'
    else
      render json: {message: "Failed to invite user"}, status: :unprocessable_entity
    end
  end

  def show
    render '/api/users/show'
  end

  def update
    @user.update!(user_update_params)
    render 'api/users/show'
  end

  def resend_invitation
    @user.invite!
    render 'api/users/show'
  end

  def profile
    @user = current_user
    @static_data = view_context.static_data
    render '/api/users/profile'
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
    params.require(:user).permit(:first_name, :last_name, :email, :timezone, :user_role_id)
  end

  def user_update_params
    params.require(:user).permit(:id, :password, :password_confirmation, :first_name, :last_name, :personal_vision, :email, :timezone, daily_logs_attributes: [:id, :work_status, :create_my_day, :evening_reflection])
  end

  def set_user
    @user = User.find(params[:id])
    authorize @user
  end
end
