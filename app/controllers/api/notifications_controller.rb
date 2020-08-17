class Api::NotificationsController < Api::ApplicationController
  respond_to :json
  before_action :set_notifications, only: [:index]
  before_action :set_notification, only: [:update]

  def index
    render '/api/notifications/index'
  end

  def update
    @notification.update!(notification_params)
    set_notifications
    render '/api/notifications/index'
  end

  private
  def set_notifications
    @notifications = policy_scope(Notification).owned_by_user(current_user)
  end

  def set_notification
    @notification = policy_scope(Notification).find(params[:id])
    authorize @notification
  end

  def notification_params
    params.require(:notification).permit(:rule, :method, :active)
  end
end
