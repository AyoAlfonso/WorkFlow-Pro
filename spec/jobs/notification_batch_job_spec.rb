require 'rails_helper'

RSpec.describe NotificationBatchJob, type: :job do
  context 'perform with enabled notifications' do
    let(:notification_batch_job) { NotificationBatchJob.new }
    # Notifications are created when the user is created
    let!(:user) { create(:user)}

    before :each do
      user.notifications.update_all(method: 'email')
      notification_batch_job.perform
    end

    it 'should enqueue a job for each enabled notification' do
      expect(NotificationEmailJob.jobs.size).to eq(user.notifications.count)
    end
  end

  context 'perform without enabled notifications' do
    let(:notification_batch_job) { NotificationBatchJob.new }
    let!(:user) { create(:user)}

    before :each do
      NotificationEmailJob.clear
      notification_batch_job.perform
    end

    it 'should enqueue a job for each enabled notification' do
      expect(NotificationEmailJob.jobs.size).to eq(0)
    end
  end
end
