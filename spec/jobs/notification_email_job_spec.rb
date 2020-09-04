require 'rails_helper'
include NotificationsHelper
include NotificationsSpecHelper

RSpec.describe NotificationEmailJob, type: :job do
  context 'perform with create_my_day notification type' do
    let(:notification_email_job) { NotificationEmailJob.new }
    let(:notification_type) { 'create_my_day' }
    # Notifications are created when the user is created
    Timecop.freeze('2020-08-10 5:30:00 -0700') do
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
    end
    let!(:daily_log) { create(:daily_log, user_id: user.id) }

    before :each do
      Timecop.freeze('2020-08-13 12:00:00 -0700') do
        Sidekiq::Testing.inline! do
          notification = user.notifications.find_by(notification_type: notification_type)
          update_start_time_to_be_in_past(notification)
          notification_email_job.perform(notification.id)
        end
      end
    end

    it 'should send an email' do
      expect(ActionMailer::Base.deliveries.length).to eq(2) # user confirmation email and notification email
      expect(ActionMailer::Base.deliveries.last.subject).to eq("Notification - #{human_type(notification_type)}")
    end
  end

  context 'perform with create_my_day notification type afer completing the daily log' do
    let(:notification_email_job) { NotificationEmailJob.new }
    Timecop.freeze('2020-08-19 5:30:00 -0700') do
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
    end
    let!(:daily_log) { create(:daily_log, user_id: user.id, log_date: '2020-08-20') }

    before :each do
      Timecop.freeze('2020-08-20 12:00:00 -0700') do
        Sidekiq::Testing.inline! do
          notification = user.notifications.find_by(notification_type: 'create_my_day')
          update_start_time_to_be_in_past(notification)
          notification_email_job.perform(notification.id)
        end
      end
    end

    it 'should not send an email' do
      expect(ActionMailer::Base.deliveries.length).to eq(1) # user confirmation email
      expect(ActionMailer::Base.deliveries.last.subject.to_s).to eq(I18n.t 'devise.mailer.confirmation_instructions.subject')
    end
  end

  context 'perform with create_my_day notification type before noon' do
    let(:notification_email_job) { NotificationEmailJob.new }
    Timecop.freeze('2020-08-19 5:30:00 -0700') do
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
    end
    let!(:daily_log) { create(:daily_log, user_id: user.id) }

    before :each do
      Timecop.freeze('2020-08-20 10:00:00 -0700') do
        Sidekiq::Testing.inline! do
          notification = user.notifications.find_by(notification_type: 'create_my_day')
          update_start_time_to_be_in_past(notification)
          notification_email_job.perform(notification.id)
        end
      end
    end

    it 'should send not send an email' do
      expect(ActionMailer::Base.deliveries.length).to eq(1) # user confirmation email
      expect(ActionMailer::Base.deliveries.last.subject.to_s).to eq(I18n.t 'devise.mailer.confirmation_instructions.subject')
    end
  end

  context 'perform with weekly_report notification' do
    let(:notification_email_job) { NotificationEmailJob.new }
    let(:notification_type) { 'weekly_report' }
    Timecop.freeze('2020-08-19 5:30:00 -0700') do
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
    end
    let!(:daily_log) { create(:daily_log, user_id: user.id) }

    before :each do
      Timecop.freeze('2020-08-21 17:00:00 -0700') do
        Sidekiq::Testing.inline! do
          notification = user.notifications.find_by(notification_type: notification_type)
          update_start_time_to_be_in_past(notification)
          notification_email_job.perform(notification.id)
        end
      end
    end

    it 'should send an email at 5:00 PM on Fridays' do
      expect(ActionMailer::Base.deliveries.length).to eq(2) # user confirmation email and notification email
      expect(ActionMailer::Base.deliveries.last.subject.to_s).to eq("Notification - #{human_type(notification_type)}")
    end
  end

  context 'perform with weekly_alignment_meeting type' do
    let(:notification_email_job) { NotificationEmailJob.new }
    let(:notification_type) { 'weekly_alignment_meeting' }
    Timecop.freeze('2020-08-19 5:30:00 -0700') do
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
      let!(:team) { create(:team) }
      let!(:team_user_enablement) { create(:team_user_enablement, team_id: team.id, user_id: user.id, role: 'team_lead') }
    end
    let!(:meeting_template) { create(:meeting_template, meeting_type: 'team_weekly') }
    let!(:meeting) do
      create(:meeting, meeting_template_id: meeting_template.id, scheduled_start_time: '2020-08-24 10:00 -0700', team_id: team.id)
    end

    before :each do
      Timecop.freeze('2020-08-24 10:00 -0700') do
        Sidekiq::Testing.inline! do
          notification = user.notifications.find_by(notification_type: notification_type)
          update_start_time_to_be_in_past(notification)
          notification_email_job.perform(notification.id)
        end
      end
    end

    it 'should send an email if the notification is scheduled during the job run time' do
      expect(ActionMailer::Base.deliveries.length).to eq(2) # user confirmation email and notification email
      expect(ActionMailer::Base.deliveries.last.subject).to eq("Notification - #{human_type(notification_type)}")
    end
  end

  context 'perform with weekly_planning type' do
    let(:notification_email_job) { NotificationEmailJob.new }
    let(:notification_type) { 'weekly_planning' }
    Timecop.freeze('2020-08-12 5:30:00 -0700') do
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
      let!(:team) { create(:team) }
      let!(:team_user_enablement) { create(:team_user_enablement, team_id: team.id, user_id: user.id, role: 'team_lead') }
    end
    let!(:meeting_template) { create(:meeting_template, meeting_type: 'team_weekly') }
    let!(:meeting) do
      create(:meeting, meeting_template_id: meeting_template.id, scheduled_start_time: '2020-08-24 10:00 -0700', team_id: team.id)
    end

    before :each do
      Timecop.freeze('2020-08-17 10:00 -0700') do
        Sidekiq::Testing.inline! do
          notification = user.notifications.find_by(notification_type: notification_type)
          update_start_time_to_be_in_past(notification)
          notification_email_job.perform(notification.id)
        end
      end
    end

    it 'should send an email if the notification is scheduled during the job run time' do
      expect(ActionMailer::Base.deliveries.length).to eq(2) # user confirmation email and notification email
      expect(ActionMailer::Base.deliveries.last.subject).to eq("Notification - #{human_type(notification_type)}")
    end
  end
end
