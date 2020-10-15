require 'rails_helper'

RSpec.describe Company, type: :model do

  describe "current_fiscal_year / quarter" do
    before :each do
      Timecop.freeze(2020, 10, 2) 
    end 
    context "company has an old fiscal year start" do
      let(:company_1) {create(:company, fiscal_year_start: "2017-01-01")}
      let(:company_2) {create(:company, fiscal_year_start: "2017-09-01")}
      let(:company_3) {create(:company, fiscal_year_start: "2017-11-01")}
      let(:company_4) {create(:company, fiscal_year_start: "2017-07-01")}
      let(:company_5) {create(:company, fiscal_year_start: "2017-02-01")}

      it "uses the right year" do
        expect(company_1.current_fiscal_year).to eq 2020
        expect(company_2.current_fiscal_year).to eq 2021
        expect(company_3.current_fiscal_year).to eq 2020
        expect(company_4.current_fiscal_year).to eq 2021
        expect(company_5.current_fiscal_year).to eq 2021
      end

      it "has the right quarter" do
        expect(company_1.current_fiscal_quarter).to eq 4
        expect(company_2.current_fiscal_quarter).to eq 1
        expect(company_3.current_fiscal_quarter).to eq 4
        expect(company_4.current_fiscal_quarter).to eq 2
        expect(company_5.current_fiscal_quarter).to eq 3
      end

      it "has correct next fiscal start date" do
        expect(company_1.next_fiscal_start_date).to eq Date.new(2021,1,1)
        expect(company_2.next_fiscal_start_date).to eq Date.new(2020,9,1)+13.weeks
        expect(company_3.next_fiscal_start_date).to eq Date.new(2020,11,1)
        expect(company_4.next_fiscal_start_date).to eq Date.new(2020,7,1)+26.weeks
        expect(company_5.next_fiscal_start_date).to eq Date.new(2020,2,1)+39.weeks
      end

    end
    
    context "company has a new fiscal year start in the future" do
      let(:company_1) {create(:company, fiscal_year_start: "2021-01-01")}
      let(:company_2) {create(:company, fiscal_year_start: "2021-09-01")}
      let(:company_3) {create(:company, fiscal_year_start: "2020-11-01")}

      it "uses the right year" do
        expect(company_1.current_fiscal_year).to eq 2020
        expect(company_2.current_fiscal_year).to eq 2021
        expect(company_3.current_fiscal_year).to eq 2020
      end

      it "has the right quarter" do
        expect(company_1.current_fiscal_quarter).to eq 4
        expect(company_2.current_fiscal_quarter).to eq 1
        expect(company_3.current_fiscal_quarter).to eq 4
      end
    end

    after :each do
      Timecop.return
    end
  end
end
