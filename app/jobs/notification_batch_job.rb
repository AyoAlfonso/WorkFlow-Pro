require 'sidekiq-scheduler'
class NotificationBatchJob
  include Sidekiq::Worker

  def perform
    Notification.enabled.each do |notification|
      NotificationEmailJob.perform_async(notification.id)
    end
  end
end
