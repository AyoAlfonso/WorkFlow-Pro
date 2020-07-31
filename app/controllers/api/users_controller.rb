class Api::UsersController < Api::ApplicationController
  helper ApplicationHelper
  before_action :set_user, only: [:show, :update]
  before_action :skip_authorization, only: :profile
  respond_to :json

  def index
    @users = policy_scope(User)
    render json: @users
  end

  def create
    #generate a random password
    @user = current_user.company.users.create(user_creation_params)
  end

  def show
    render json: @user.as_json(include: [:current_daily_log])
  end

  def profile
    render json: current_user.serializable_hash(methods: [:avatar_url, :role, :current_daily_log]).merge(static_data: view_context.static_data)
  end

  def update
    @user.update!(user_update_params)
    render json: @user.as_json(include: [:current_daily_log])
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
