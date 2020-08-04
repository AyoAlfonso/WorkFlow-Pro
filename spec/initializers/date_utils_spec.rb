require 'rails_helper'

RSpec.describe Date do
  context "tests custom date methods" do
    let(:wednesday) { Date.new(2020, 01, 01) }
    it "date instance returns correct start of week as Sunday" do
      expect(wednesday.week_start.wday).to eq(0)
    end
    it "date instance returns correct end of week as Saturday" do
      expect(wednesday.week_end.wday).to eq(6)
    end
    it "date class returns correct start of week as Sunday" do
      expect(Date.current_week_start.wday).to eq(0)
    end
    it "date class returns correct end of week as Saturday" do
      expect(Date.current_week_end.wday).to eq(6)
    end
  end
end
