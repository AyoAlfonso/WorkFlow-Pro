class Api::NotificationsController < Api::ApplicationController
  respond_to :json
  include UserActivityLogHelper
  after_action :record_activities, only: [:update]
  before_action :set_notifications, only: [:index]
  before_action :set_notification, only: [:update]

  def index
    render "/api/notifications/index"
  end

  def update
    @notification.update_notification(notification_params)
    set_notifications
    render "/api/notifications/index"
  end

  private

  def set_notifications
    @notifications = policy_scope(Notification).owned_by_user(current_user).order(:id)
  end

  def set_notification
    @notification = policy_scope(Notification).find(params[:id])
    authorize @notification
  end

  def notification_params
    params.require(:notification).permit(:method, validations: [:time_of_day, :day_of_week])
  end

  def record_activities
     record_activity(params[:note], nil, params[:id])
  end
end
