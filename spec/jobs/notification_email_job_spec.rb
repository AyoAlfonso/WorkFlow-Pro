require 'rails_helper'
include NotificationsHelper
include NotificationsSpecHelper

RSpec.describe NotificationEmailJob, type: :job do
  context 'perform with create_my_day notification type when no daily log for the day' do
    let(:notification_email_job) { NotificationEmailJob.new }
    let(:notification_type) { 'create_my_day' }
    # Notifications are created when the user is created
    Timecop.freeze('2020-08-10 5:30:00 -0700') do
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
    end
    let!(:daily_log) { create(:daily_log, user_id: user.id) } #status not set

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

  context 'perform with create_my_day notification type when daily log is status not set' do
    let(:notification_email_job) { NotificationEmailJob.new }
    let(:notification_type) { 'create_my_day' }
    # Notifications are created when the user is created
    Timecop.freeze('2020-08-13 5:30:00 -0700') do
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
    end
    let!(:daily_log) { create(:daily_log, user_id: user.id, work_status: 4) } #status not set

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

  context 'perform with create_my_day notification type afer setting the status' do
    let(:notification_email_job) { NotificationEmailJob.new }
    Timecop.freeze('2020-08-20 5:30:00 -0700') do
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
    end
    let!(:daily_log) { create(:daily_log, user_id: user.id, log_date: '2020-08-20', work_status: 0) } # in office

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

  context 'perform with create_my_day notification on the weekend' do
    let(:notification_email_job) { NotificationEmailJob.new }
    let(:notification_type) { 'create_my_day' }
    # Notifications are created when the user is created
    Timecop.freeze('2020-08-15 5:30:00 -0700') do # Satuday
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
    end

    before :each do
      Timecop.freeze('2020-08-15 12:00:00 -0700') do
        Sidekiq::Testing.inline! do
          notification = user.notifications.find_by(notification_type: notification_type)
          update_start_time_to_be_in_past(notification)
          notification_email_job.perform(notification.id)
        end
      end
    end

    it 'should not send an email' do
      expect(ActionMailer::Base.deliveries.length).to eq(1) # user confirmation email and notification email
      expect(ActionMailer::Base.deliveries.last.subject).to eq("Confirmation instructions")
    end
  end

  context 'perform with weekly_report notification' do
    let(:notification_email_job) { NotificationEmailJob.new }
    let(:notification_type) { 'weekly_report' }
    Timecop.freeze('2020-08-19 5:30:00 -0700') do
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
    end
    let!(:meeting_template) { create(:meeting_template, meeting_type: :personal_weekly) }
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
      expect(ActionMailer::Base.deliveries.last.subject.to_s).to eq("#{human_type(notification_type)}")
    end
  end

  context 'perform with weekly_alignment_meeting (team_weekly) type' do
    let(:notification_email_job) { NotificationEmailJob.new }
    let(:notification_type) { 'weekly_alignment_meeting' }
    Timecop.freeze('2020-08-19 5:30:00 -0700') do
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
      let!(:team) { create(:team) }
      let!(:team_user_enablement) { create(:team_user_enablement, team_id: team.id, user_id: user.id, role: 'team_lead') }
    end
    let!(:meeting_template) { create(:meeting_template, meeting_type: 'team_weekly') }

    context "a meeting that has started" do
      let!(:meeting) do
        create(:meeting, meeting_template_id: meeting_template.id, hosted_by: user, start_time: '2020-08-23 9:45 -0700', team_id: team.id)
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
      it "should not send an email" do
        expect(ActionMailer::Base.deliveries.length).to eq(1) # user confirmation email and notification email
        expect(ActionMailer::Base.deliveries.last.subject).to_not eq("Notification - #{human_type(notification_type)}")
      end
    end

    context "a meeting that has not started" do
      #team weekly meetings may have a start time within the range of this week based on the current day
      let!(:meeting) do
        #create(:meeting, meeting_template_id: meeting_template.id, scheduled_start_time: '2020-08-24 10:00 -0700', team_id: team.id)
        create(:meeting, meeting_template_id: meeting_template.id, hosted_by: user, start_time: nil, team_id: team.id)
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
  end

  context 'perform with weekly_planning (personal_weekly) type' do
    let(:notification_email_job) { NotificationEmailJob.new }
    let(:notification_type) { 'weekly_planning' }
    Timecop.freeze('2020-08-19 5:30:00 -0700') do
      let!(:user) { create(:user, timezone: '(GMT-08:00) Pacific Time (US & Canada)')}
    end
    let!(:meeting_template) { create(:meeting_template, meeting_type: 'personal_weekly') }

    context "a meeting that has started" do
      #team weekly meetings may have a start time within the range of this week based on the current day
      let!(:meeting) do
        #create(:meeting, meeting_template_id: meeting_template.id, scheduled_start_time: '2020-08-24 10:00 -0700')
        create(:meeting, meeting_template_id: meeting_template.id, hosted_by: user, start_time: '2020-08-23 9:45 -0700')
      end

      before :each do
        Timecop.freeze('2020-08-24 10:00 -0700') do
          meeting.update(start_time: '2020-08-23 9:45 -0700')
          Sidekiq::Testing.inline! do
            notification = user.notifications.find_by(notification_type: notification_type)
            update_start_time_to_be_in_past(notification)
            notification_email_job.perform(notification.id)
          end
        end
      end

      it 'should send an email if the notification is scheduled during the job run time' do
        expect(ActionMailer::Base.deliveries.length).to eq(1) # user confirmation email and notification email
        expect(ActionMailer::Base.deliveries.last.subject).to_not eq("Notification - #{human_type(notification_type)}")
      end
    end

    context "a meeting that has not started" do

      before :each do
        Timecop.freeze('2020-08-24 10:00 -0700') do
          Sidekiq::Testing.inline! do
            notification = user.notifications.find_by(notification_type: notification_type)
            update_start_time_to_be_in_past(notification)
            notification_email_job.perform(notification.id)
          end
        end
      end

      #team weekly meetings may have a start time within the range of this week based on the current day
      it 'should send an email if the notification is scheduled during the job run time' do
        expect(ActionMailer::Base.deliveries.length).to eq(2) # user confirmation email and notification email
        expect(ActionMailer::Base.deliveries.last.subject).to eq("Notification - #{human_type(notification_type)}")
      end
    end

  end
end
