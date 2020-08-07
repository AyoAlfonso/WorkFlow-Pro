require 'rails_helper'

RSpec.describe User, type: :model do

  it "returns companies timezone if none is set" do
    c = create(:company)
    u = build(:user)
    binding.pry
    expect(u.timezone).to eq c.timezone
  end
end
