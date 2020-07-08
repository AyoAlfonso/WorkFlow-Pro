require 'rails_helper'

RSpec.describe Issue, type: :model do
  it { should belong_to(:user) }
  it { should validate_presence_of(:description)}

  context "Basic validations" do
    let!(:issue) { create(:issue) }
    it "priority defaults to low" do
      expect(issue.priority).to eq("low")
    end
    it "completed at defaults to nil" do
      expect(issue.completed_at).to be_nil
    end
  end
end
