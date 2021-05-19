require 'rails_helper'

RSpec.describe KeyActivity, type: :model do
  it { should belong_to(:user) }
  it { should validate_presence_of(:description) }

  context "Basic validations" do
    let!(:key_activity) { create(:key_activity, scheduled_group: create(:today_scheduled_group)) }
    it "priority defaults to low" do
      expect(key_activity.priority).to eq("low")
    end
    it "completed at defaults to nil" do
      expect(key_activity.completed_at).to be_nil
    end
  end
end
