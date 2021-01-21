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
        expect(company_1.next_quarter_start_date).to eq Date.new(2021,1,1)
        expect(company_2.next_quarter_start_date).to eq Date.new(2020,9,1)+13.weeks
        expect(company_3.next_quarter_start_date).to eq Date.new(2020,11,1)
        expect(company_4.next_quarter_start_date).to eq Date.new(2020,7,1)+26.weeks
        expect(company_5.next_quarter_start_date).to eq Date.new(2020,2,1)+39.weeks
      end

    end
    
    context "company has a new fiscal year start in the future" do
      let(:company_1) {create(:company, fiscal_year_start: "2020-01-01")}
      let(:company_2) {create(:company, fiscal_year_start: "2020-09-01")}
      let(:company_3) {create(:company, fiscal_year_start: "2019-11-01")}

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


  describe "current fiscal year date for beginning of year" do
    before :each do
      Timecop.freeze(2021, 1, 2) #in GMT time, Jan 1 PST
    end 
    context "company has an old fiscal year start" do
      let(:company_1) {create(:company, fiscal_year_start: "2017-01-01")}
      let(:company_2) {create(:company, fiscal_year_start: "2017-09-01")}
      let(:company_3) {create(:company, fiscal_year_start: "2017-11-01")}
      let(:company_4) {create(:company, fiscal_year_start: "2017-07-01")}
      let(:company_5) {create(:company, fiscal_year_start: "2017-02-01")}

      it "uses the right year" do
        expect(company_1.current_fiscal_year).to eq 2021
        expect(company_2.current_fiscal_year).to eq 2021
        expect(company_3.current_fiscal_year).to eq 2021
        expect(company_4.current_fiscal_year).to eq 2021
        expect(company_5.current_fiscal_year).to eq 2021
      end

      it "has the right quarter" do
        expect(company_1.current_fiscal_quarter).to eq 1
        expect(company_2.current_fiscal_quarter).to eq 2
        expect(company_3.current_fiscal_quarter).to eq 1
        expect(company_4.current_fiscal_quarter).to eq 3
        expect(company_5.current_fiscal_quarter).to eq 4
      end

      it "has correct next fiscal start date" do
        expect(company_1.next_quarter_start_date).to eq Date.new(2021,1,1)+13.weeks
        expect(company_2.next_quarter_start_date).to eq Date.new(2020,9,1)+26.weeks
        expect(company_3.next_quarter_start_date).to eq Date.new(2020,11,1)+13.weeks
        expect(company_4.next_quarter_start_date).to eq Date.new(2020,7,1)+39.weeks
        expect(company_5.next_quarter_start_date).to eq Date.new(2021,2,1)
      end

    end

    describe "fiscal_year_range" do
      describe "non Jan 1" do
        before :each do
          Timecop.freeze(2020, 6, 1) 
        end 
        let(:company_1) {create(:company, fiscal_year_start: "2017-01-01")}
        let(:company_2) {create(:company, fiscal_year_start: "2017-03-01")}
        let(:company_3) {create(:company, fiscal_year_start: "2017-09-01")}
        let(:company_4) {create(:company, fiscal_year_start: "2020-03-01")}
        let(:company_5) {create(:company, fiscal_year_start: "2020-06-01")}
        let(:company_6) {create(:company, fiscal_year_start: "2020-01-01")}

        it "should generate a range that is from the first fiscal year until 1 year + current fiscal year" do
          expect(company_1.fiscal_year_range.map{|r| r[:year]}).to eq [2017, 2018, 2019, 2020, 2021]
          expect(company_2.fiscal_year_range.map{|r| r[:year]}).to eq [2017, 2018, 2019, 2020, 2021, 2022]
          expect(company_3.fiscal_year_range.map{|r| r[:year]}).to eq [2017, 2018, 2019, 2020, 2021]
          expect(company_4.fiscal_year_range.map{|r| r[:year]}).to eq [2020, 2021, 2022]
          expect(company_5.fiscal_year_range.map{|r| r[:year]}).to eq [2020, 2021, 2022]
          expect(company_6.fiscal_year_range.map{|r| r[:year]}).to eq [2020, 2021]

        end
      end

      describe "non Jan 1" do
        before :each do
          Timecop.freeze(2020, 1, 2) #in GMT time, Jan 1 PST
        end 
        let(:company_1) {create(:company, fiscal_year_start: "2017-01-01")} #2020
        let(:company_2) {create(:company, fiscal_year_start: "2017-03-01")}
        let(:company_3) {create(:company, fiscal_year_start: "2020-01-01")}

        it "should generate a range that is from the first fiscal year until 1 year + current fiscal year" do
          expect(company_1.fiscal_year_range.map{|r| r[:year]}).to eq [2017, 2018, 2019, 2020, 2021]
          expect(company_2.fiscal_year_range.map{|r| r[:year]}).to eq [2017, 2018, 2019, 2020, 2021]
          expect(company_3.fiscal_year_range.map{|r| r[:year]}).to eq [2020, 2021]
        end
      end
    end
    after :each do
      Timecop.return
    end
  end
end
