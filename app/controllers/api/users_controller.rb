class Api::UsersController < Api::ApplicationController
  helper ApplicationHelper
  before_action :set_user, only: [:show, :update, :destroy, :resend_invitation]
  skip_before_action :authenticate_user!, only: [:reset_password]
  before_action :skip_authorization, only: [:profile, :reset_password]
  respond_to :json

  def index
    @users = policy_scope(User)
    render '/api/users/index'
  end

  def create
    authorize current_user
    if User.find_by_email(user_creation_params[:email]).present?
      render json: {message: "User already created."}, status: :unprocessable_entity
      return
    end

    @user = User.invite!(user_creation_params.merge(company_id: current_company.id, default_selected_company_id: current_company.id))

    if @user.valid? && @user.persisted?
      @user.update!({user_company_enablements_attributes: create_user_company_enablement_attribute_parser, team_user_enablements_attributes: team_user_enablement_attribute_parser(params[:user][:teams])})
      render '/api/users/show'
    else
      render json: {message: "Failed to invite user"}, status: :unprocessable_entity
    end
  end

  def show
    render '/api/users/show'
  end

  def update
    @user.update!(params[:user][:teams].present? ? user_update_params.merge(team_user_enablements_attributes: team_user_enablement_attribute_parser(params[:user][:teams])) : user_update_params)
    render 'api/users/show'
  end

  def destroy
    @user.soft_delete
    render 'api/users/show'
  end

  def resend_invitation
    @user.invite!
    render 'api/users/show'
  end

  def reset_password
    @user = User.find_by_email!(params[:email]) #for security reasons do not let user know if they are not found in database.
    if @user.present?
      @user.send_reset_password_instructions
      render json: {message: "An email has been sent to reset your password, please check it there."}
    end
  end

  def invite_users_to_company
    team = Team.where(id: params[:team_id])
    email_addresses = params[:email_addresses].split(',')
    email_addresses.each do |email|
      sanitized_email = email.strip
      if User.find_by_email(sanitized_email).blank?
        @user = User.create!({
          email: sanitized_email, 
          company_id: current_company.id, 
          default_selected_company_id: current_company.id,
          password: ENV["DEFAULT_PASSWORD"]
        })
        @user.invite!
        @user.assign_attributes({
          user_company_enablements_attributes: create_user_company_enablement_attribute_parser, 
          team_user_enablements_attributes: team_user_enablement_attribute_parser(team)
        })
        @user.save(validate: false)
      end
    end
    authorize current_user
    @users = policy_scope(User)
    render '/api/users/index'
  end

  def profile
    @user = current_user
    @session_company_id = current_company.id
    @static_data = view_context.static_data
    @scheduled_groups = ScheduledGroup.all
    @user_first_access_to_forum = current_company.display_format == "Forum" && current_user.user_company_enablements.find_by_company_id(current_company.id)&.first_time_access
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

  def update_team_role
    authorize current_user
    team_user_enablement = TeamUserEnablement.where(user_id: params[:user_id], team_id: params[:team_id]).first
    team_user_enablement.update!(role: params[:can_edit] ? 1 : 0)
    @user = User.find(params[:user_id])
    render 'api/users/show'
  end

  def update_company_first_time_access
    authorize current_user
    user_company_enablement = current_user.user_company_enablements.find_by_company_id(params[:company_id])
    user_company_enablement.update!(first_time_access: params[:first_time_access])
    @user = current_user
    render '/api/users/profile'
  end


  private

  def user_creation_params
    params.require(:user).permit(:first_name, :last_name, :email, :timezone, :user_role_id, :title)
  end

  def user_update_params
    params.require(:user).permit(:id, :password, :password_confirmation, :first_name, :last_name, :personal_vision, :email, :timezone, :user_role_id, :default_selected_company_id, :title, daily_logs_attributes: [:id, :work_status, :create_my_day, :evening_reflection, :title, :mip_count, :weekly_reflection, :monthly_reflection])
  end

  def set_user
    @user = User.find(params[:id])
    authorize @user
  end

  def create_user_company_enablement_attribute_parser
    [{
      user_id: @user.id, 
      company_id: current_company.id,
      user_title: params[:user][:title],
      user_role_id: params[:user] && params[:user][:user_role_id] ? params[:user][:user_role_id] : UserRole.find_by_name("Employee").id
    }]
  end

  def team_user_enablement_attribute_parser(teams)
    tue_list = []
    teams.each do |team|
      tue_list.push({
        team_id: team[:id],
        user_id: @user.id,
        role: 0
      })
    end

    @user.team_user_enablements.each do |tue|
      tue_list.push({
        id: tue.id,
        _destroy: true
      }) if !tue_list.any? { |enablement| enablement[:team_id] == tue.team_id && enablement[:user_id] == tue.user_id }
    end

    tue_list
  end
end
