require 'sidekiq-scheduler'
class TestNotificationsJob
  include Sidekiq::Worker
  include NotificationsHelper
  include NotificationEmailJobHelper
  include StatsHelper

  def perform(user_id)
    @user = User.find(user_id)
    send_person_planning_reminder_email(@user, "Create My Day")
    send_end_of_week_stats_email(@user, "Weekly Report")
    @user.team_user_enablements.team_lead.each do |team_lead_enablement|
      send_sync_meeting_email(@user, "Weekly Alignment Meeting", team_lead_enablement&.team)
    end
  end
end
